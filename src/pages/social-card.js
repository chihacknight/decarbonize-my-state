import React from "react"
import SEO from "../components/seo"
import SingleBarChart from "../components/singlebar"
import { graphql } from "gatsby"
import { node } from "prop-types"

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

const SocialCardPage = ({data}) => {
  let params = new URLSearchParams(document.location.search)
  let currentState = params.get("state")
  let emissionsData = data.allEmissionsJson.edges
    .find(entry => entry.node.state === currentState)
  {console.log(data)}

  var eachStateRecentEmissions = []
  var counter = 0
  var emitterSuffix = 'th'

  for (const stateData of data.allEmissionsJson.edges)
  {
    var tempState = stateData.node.state
    var stateTotalEmissions = 0

    if (tempState == 'united_states')
    {
      continue
    }
        
    var mostRecentEmissions = stateData.node.emissionsByYear[stateData.node.emissionsByYear.length-1]
    for (const [k,v] of Object.entries(mostRecentEmissions))
    {
      stateTotalEmissions += v
    }

        
    eachStateRecentEmissions[counter] = [tempState, stateTotalEmissions, counter]
    counter += 1
  }
    
  eachStateRecentEmissions.sort((a,b) => b[1]-a[1])

  for(var i=0;i<eachStateRecentEmissions.length;i++)
  {
    eachStateRecentEmissions[i][2] = i
  }

  let statePosInArr = eachStateRecentEmissions
    .find(entry => entry[0]===currentState)

  var finalDigitOfStatePos = statePosInArr[2]%10
  if(finalDigitOfStatePos+1 == 1)
  {
    emitterSuffix = 'st'
  }
  else if (finalDigitOfStatePos+1==2)
  {
    emitterSuffix = 'nd'
  }
  else if (finalDigitOfStatePos+1==3)
  {
    emitterSuffix = 'rd'
  }

  const placeTitle = slugToTitle(currentState)
  const stateFaceClass = currentState.toLowerCase().replaceAll(" ", "-")

  let nodeData = emissionsData.node.emissionsByYear

  return(
    <div className='social-card d-flex flex-column'>
      <SEO title="Social Card" />
      <div className="d-flex justify-content-between mr-2"
        style={{height: '418px', width:'800px'}}
      >
 
        <div className="d-flex align-items-center col-6">
          <span
            className={"text-left display-3 sf-" + stateFaceClass}
            aria-hidden="true"
            style={{fontSize: '200px'}}

          ></span>

          <div>
            <h3 id="main" className= "d-flex align-items-center mr-4 mt-0 mb-0" >
              <span className="title font-weight-bold h4 mb-0"
                // style={{fontSize:(28/placeTitle.length)+'rem'}}
                style={{fontSize:3.5+'rem'}}
              >{placeTitle}</span>
            </h3>

            <h4>{(statePosInArr[2]+1)+emitterSuffix} Highest Emitter</h4>
          </div>
        </div>

        <div className="col-6 d-block d-xl-none ml-2 justify-content-end">

          <p
            className="text-right pt-2"
            style={{fontSize:'15px'}}
          >CO2 Equivalent Emissions in {placeTitle} by Source</p>
          <div className="justify-content-end ml-5 pl-5"            >

            <SingleBarChart
              emissionsData={nodeData[emissionsData.node.emissionsByYear.length-1]}
              socialCardView={true}
            />
          </div>
        </div>
      </div>
      <h2 className="p-2 m-0 text-left" 
        style={{width:'800px'}}        
      >Decarb My State</h2>
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
