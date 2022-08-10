import React from "react"
import SEO from "../components/seo"
import SingleBarChart from "../components/singlebar"
import { graphql } from "gatsby"

//TODO: move to shared file with state details
const slugToTitle = (placeName) => {
  const words = placeName.split("_")

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word === "of") {
      words[i] = word
    } else {
      words[i] = word.charAt(0).toUpperCase() + word.slice(1)
    }
  }

  return words.join(" ")
}

const SocialCardPage = ({ location, data }) => {
  //get the state data
  let params = new URLSearchParams(location.search)
  let currentState = params.get("state")
  let emissionsData = data.allEmissionsJson.edges.find(
    (entry) => entry.node.state === currentState
  )

  if (emissionsData == null) {
    emissionsData = data.allEmissionsJson.edges.find(
      (entry) => entry.node.state === "illinois"
    )
    currentState = "illinois"
  }

  //used for ranking the states
  var eachStateRecentEmissions = []
  var counter = 0
  var emitterSuffix = "th"

  //go through each of the staes
  for (const stateData of data.allEmissionsJson.edges) {
    var tempState = stateData.node.state
    var stateTotalEmissions = 0

    if (tempState === "united_states") {
      continue
    }

    //sum all the emission categories to get total emissions for the recent year
    var mostRecentEmissions =
      stateData.node.emissionsByYear[stateData.node.emissionsByYear.length - 1]
    for (const v of Object.values(mostRecentEmissions)) {
      stateTotalEmissions += v
    }

    //store in array of array containing state name, total emissions, and initial position
    eachStateRecentEmissions[counter] = [
      tempState,
      stateTotalEmissions,
      counter,
    ]
    counter += 1
  }

  //sort array by emisisons
  eachStateRecentEmissions.sort((a, b) => b[1] - a[1])

  //change the position of each state to reflect their new position in sorted array
  for (var i = 0; i < eachStateRecentEmissions.length; i++) {
    eachStateRecentEmissions[i][2] = i
  }

  //find the data correspoinding to the current page
  let statePosInArr = eachStateRecentEmissions.find(
    (entry) => entry[0] === currentState
  )

  //to be used for specifically checks with /social-card/ which dont have a ?state={}
  if (statePosInArr == null) {
    statePosInArr = eachStateRecentEmissions.find(
      (entry) => entry[0] === "illinois"
    )
  }

  //alter what the suffix of the number is
  var finalDigitOfStatePos = statePosInArr[2] % 10
  if (finalDigitOfStatePos + 1 === 1) {
    emitterSuffix = "st"
  } else if (finalDigitOfStatePos + 1 === 2) {
    emitterSuffix = "nd"
  } else if (finalDigitOfStatePos + 1 === 3) {
    emitterSuffix = "rd"
  }

  const placeTitle = slugToTitle(currentState)
  const stateFaceClass = currentState.toLowerCase().replaceAll(" ", "-")

  let nodeData = emissionsData.node.emissionsByYear

  var stateNameSize = 3.5
  if (
    currentState === "tennessee" ||
    currentState === "pennsylvania" ||
    currentState === "washington" ||
    currentState === "oklahoma" ||
    currentState === "connecticut" ||
    currentState === "maryland" ||
    currentState === "north_carolina" ||
    currentState === "colorado" ||
    currentState === "kentucky" ||
    currentState === "nebraska"
  ) {
    stateNameSize = 2.5
  }
  if (currentState === "massachusetts") {
    stateNameSize = 1.6
  }

  return (
    <div className="social-card d-flex flex-column">
      <SEO title="Social Card" />
      <div
        className="d-flex justify-content-between mr-2"
        style={{ height: "418px", width: "800px" }}
      >
        {/*state name, image and emitter rank */}
        <div className="d-flex align-items-center col-6">
          <span
            className={"text-left display-3 sf-" + stateFaceClass}
            aria-hidden="true"
            style={{ fontSize: "200px" }}
          ></span>

          <div style={{ flexWrap: "wrap", width: "50%" }}>
            <h3 id="main" className="d-flex align-items-center mr-4 mt-0 mb-0">
              <span
                className="title font-weight-bold h4 mb-0"
                style={{
                  fontSize: stateNameSize + "rem",
                }}
              >
                {placeTitle}
              </span>
            </h3>

            <h4>{statePosInArr[2] + 1 + emitterSuffix} Highest Emitter</h4>
          </div>
        </div>

        <div className="col-6 d-block d-xl-none ml-2 justify-content-end">
          {/* state emissions */}
          <p className="text-right pt-2" style={{ fontSize: "15px" }}>
            CO2 Equivalent Emissions in {placeTitle} by Source
          </p>
          <div className="justify-content-end ml-4 pl-4">
            <SingleBarChart
              emissionsData={
                nodeData[emissionsData.node.emissionsByYear.length - 1]
              }
              socialCardView={true}
            />
          </div>
        </div>
      </div>
      <h2 className="p-2 m-0 text-left" style={{ width: "800px" }}>
        Decarb My State
      </h2>
    </div>
  )
}

export default SocialCardPage

export const query = graphql`
  query SocialQuery {
    allEmissionsJson {
      edges {
        node {
          state
          emissionsByYear {
            dirty_power
            buildings
            dumps_farms_industrial_other
            transportation
            year
          }
        }
      }
    }
  }
`
