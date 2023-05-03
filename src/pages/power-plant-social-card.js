import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/seo"
import SingleBarChart from "../components/singlebar"
import { slugToTitle } from "../helper-functions"

/**
 *
 * http://localhost:8000/power-plant-social-card/?state=illinois&plant=baldwin-energy-complex
 */

const PowerPlantSocialCardPage = ({ location, data }) => {
  //get the state data
  let params = new URLSearchParams(location.search)
  let CurrentStateSlug = params.get("state")
  const CurrentPlantSlug = params.get("plant")

  const StateData = data.allPowerPlantsJson.edges.find(
    entry => entry.node.state === CurrentStateSlug
  )

  const PowerPlantData = StateData.node.power_plants.find(plant => plant.slug === CurrentPlantSlug);

  console.log(PowerPlantData);

  const placeTitle = slugToTitle(CurrentStateSlug)
  const stateFaceClass = CurrentStateSlug.toLowerCase().replaceAll(" ", "-")

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
              >
                {placeTitle}
              </span>
            </h3>
          </div>
        </div>

        <div className="col-6 d-block d-xl-none ml-2 justify-content-end">
          {/* state emissions */}
          <p className="text-right pt-2" style={{ fontSize: "15px" }}>
            CO<sub>2</sub> Equivalent Emissions in {placeTitle} by Source
          </p>
          <div className="justify-content-end ml-4 pl-4">
          </div>
        </div>
      </div>
      <h2 className="p-2 m-0 text-left" style={{ width: "800px" }}>
        Decarb My State
      </h2>
    </div>
  )
}

export default PowerPlantSocialCardPage

export const query = graphql`
  query PowerPlantSocialQuery {
    allPowerPlantsJson {
        edges {
          node {
            state
            power_plants {
              slug
              plant_name
              fossil_fuel_category
              county
              capacity_mw
              Plant_annual_net_generation__MWh_
              Plant_annual_SO2_emissions__tons_
              Plant_annual_NOx_emissions__tons_
              Plant_annual_N2O_emissions__lbs_
              Plant_annual_CH4_emissions__lbs_
              Plant_annual_CO2_emissions__tons_
              Plant_annual_CO2_equivalent_emissions__tons_
              Longitude
              Latitude
            }
          }
        }
      }
  }
`
