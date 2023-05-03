import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/seo"
import SingleBarChart from "../components/singlebar"
import { slugToTitle } from "../helper-functions"

/**
 * Rank a state
 *
 * Returns { statePosInArr: number, emitterSuffix: string }
 *
 * E.g. { statePosInArr: 5, emitterSuffix: 'th' }
 */
function rankState(data, CurrStateSlug) {
  // used for ranking the states
  var eachStateRecentEmissions = []
  var counter = 0

  // go through each of the states
  for (const stateData of data.allEmissionsJson.edges) {
    var tempState = stateData.node.state
    var stateTotalEmissions = 0

    if (tempState === "united_states") {
      continue
    }

    // sum all the emission categories to get total emissions for the recent year
    var mostRecentEmissions =
      stateData.node.emissionsByYear[stateData.node.emissionsByYear.length - 1]
    for (const v of Object.values(mostRecentEmissions)) {
      stateTotalEmissions += v
    }

    // store in array of array containing state name, total emissions, and initial position
    eachStateRecentEmissions[counter] = [
      tempState,
      stateTotalEmissions,
      counter,
    ]
    counter += 1
  }

  // sort array by emissions
  eachStateRecentEmissions.sort((a, b) => b[1] - a[1])

  // change the position of each state to reflect their new position in sorted array
  for (var i = 0; i < eachStateRecentEmissions.length; i++) {
    eachStateRecentEmissions[i][2] = i
  }

  // find the data corresponding to the current page
  let statePosInArr = eachStateRecentEmissions.find(
    entry => entry[0] === CurrStateSlug
  )[2]

  // alter what the suffix of the number is
  var emitterSuffix = "th" // default to th (e.g. 4th, 5th)
  var finalDigitOfStatePos = statePosInArr % 10

  // 1 -> 1st
  if (finalDigitOfStatePos + 1 === 1) {
    emitterSuffix = "st"
  }
  // 2 -> 2nd
  else if (finalDigitOfStatePos + 1 === 2) {
    emitterSuffix = "nd"
  }
  // 3 -> 3rd
  else if (finalDigitOfStatePos + 1 === 3) {
    emitterSuffix = "rd"
  }

  return { emitterSuffix, statePosInArr }
}

/**
 * A page we take screenshots of to make the meta images. Example:
 *
 * /social-card?state=illinois
 *
 * Make sure to load at a smaller screen size
 */
const SocialCardPage = ({ location, data }) => {
  //get the state data
  const params = new URLSearchParams(location.search)

  // If no state selected, default to Illinois
  const CurrStateSlug = params.get("state") || "illinois"

  let emissionsData = data.allEmissionsJson.edges.find(
    entry => entry.node.state === CurrStateSlug
  )

  // Rank the state and get the
  const { statePosInArr, emitterSuffix } = rankState(data, CurrStateSlug)

  const placeTitle = slugToTitle(CurrStateSlug)
  const stateFaceClass = CurrStateSlug.toLowerCase().replaceAll(" ", "-")

  let nodeData = emissionsData.node.emissionsByYear

  var stateNameSize = 3.5

  if (
    CurrStateSlug === "tennessee" ||
    CurrStateSlug === "pennsylvania" ||
    CurrStateSlug === "washington" ||
    CurrStateSlug === "oklahoma" ||
    CurrStateSlug === "connecticut" ||
    CurrStateSlug === "maryland" ||
    CurrStateSlug === "north_carolina" ||
    CurrStateSlug === "colorado" ||
    CurrStateSlug === "kentucky" ||
    CurrStateSlug === "nebraska"
  ) {
    stateNameSize = 2.3
  }
  if (CurrStateSlug === "massachusetts") {
    stateNameSize = 1.6
  }

  return (
    <div className="social-card d-flex flex-column">
      <SEO title="Social Card" />
      <div
        className="d-flex justify-content-between"
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

            <h4>{statePosInArr + 1 + emitterSuffix} Highest Emitter</h4>
          </div>
        </div>

        <div className="col-6 d-block ml-2 justify-content-end">
          {/* state emissions */}
          <p className="text-right pt-2" style={{ fontSize: "15px" }}>
            CO<sub>2</sub> Equivalent Emissions in {placeTitle} by Source
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
