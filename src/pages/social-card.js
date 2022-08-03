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
  {console.log(emissionsData)}

  // place info and string
  // clean up title as needed
  const placeTitle = slugToTitle(currentState)
  const stateFaceClass = currentState.toLowerCase().replaceAll(" ", "-")

  let nodeData = emissionsData.node.emissionsByYear

  return(
    <div className='social-card d-flex flex-column'>
      <SEO title="Social Card" />
      <div className="d-flex justify-content-between mr-2"
        style={{height: '418px', width:'800px'}}
      >
 
        <div className="d-flex align-items-center col-6"
            // style={{border: 'solid 1px red'}}
        >
          <span
            className={"text-left display-3 sf-" + stateFaceClass}
            aria-hidden="true"
            style={{fontSize: '200px'}}

          ></span>

          <div>
            <h3 id="main" className= "d-flex align-items-center mr-4 mt-0 mb-0" >
                <span className="title font-weight-bold h4 mb-0"
                style={{fontSize:'3.5rem'}}
                >{placeTitle}</span>
            </h3>

            <h4>3rd Highest Emitter</h4>
          </div>
        </div>

        <div className="col-6 d-block d-xl-none ml-2 justify-content-end"
            // style={{border: 'solid 1px blue'}}

        >
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
