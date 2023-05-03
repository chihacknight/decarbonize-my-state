import React from "react"
import { graphql } from "gatsby"

import SEO from "../components/seo"
import { slugToTitle } from "../helper-functions"
import OilPlantImg from "../images/oil-plant.png"
import GasPlantImg from "../images/gas-plant.png"
import CoalPlantImg from "../images/coal-plant.png"

/**
 *
 * http://localhost:8000/power-plant-social-card/?state=illinois&plant=baldwin-energy-complex
 */

const PowerPlantSocialCardPage = ({ location, data }) => {
  //get the state data
  let params = new URLSearchParams(location.search)
  const CurrentStateSlug = params.get("state")
  const CurrentPlantSlug = params.get("plant")

  const StateTitle = slugToTitle(CurrentStateSlug)
  const StateFaceClass = CurrentStateSlug.toLowerCase().replaceAll(" ", "-")

  const StateData = data.allPowerPlantsJson.edges.find(
    entry => entry.node.state === CurrentStateSlug
  )

  const PowerPlant = StateData.node.power_plants.find(
    plant => plant.slug === CurrentPlantSlug
  )

  return (
    <div className="social-card d-flex flex-column">
      <SEO title="Power Plant Social Card" />
      <div
        className="d-flex justify-content-between"
        style={{ height: "418px", width: "800px" }}
      >
        <div className="d-flex align-items-center p-5">
          <div className="power-plant-profile ml-2">
            {PowerPlant.fossil_fuel_category.toLowerCase() === "oil" && (
              <img src={OilPlantImg} alt="Oil power plant" />
            )}
            {PowerPlant.fossil_fuel_category.toLowerCase() === "gas" && (
              <img src={GasPlantImg} alt="Gas power plant" />
            )}
            {PowerPlant.fossil_fuel_category.toLowerCase() === "coal" && (
              <img src={CoalPlantImg} alt="Coal power plant" />
            )}

            <div
              className={"state-icon sf-" + StateFaceClass}
              aria-hidden="true"
            ></div>
          </div>
        </div>

        <div className="d-flex flex-column justify-content-center flex-grow-1">
          <div>
            <h1 className="h2 mb-0 mt-0">{PowerPlant.plant_name}</h1>

            <div className="h5 mb-0 font-weight-bold">
              <span className="text-capitalize">
                {PowerPlant.fossil_fuel_category.toLowerCase()}
              </span>{" "}
              Power Plant
            </div>
            <div>
              {PowerPlant.county} County, {StateTitle}
            </div>
          </div>

          <div className="d-flex mt-3">
            <div>
              <strong>Capacity</strong>
              <br />
              <span>
                {Math.round(PowerPlant.capacity_mw).toLocaleString()} Megawatts
              </span>
            </div>

            <div className="ml-4">
              <strong>Annual Net Generation</strong>
              <br />
              <span>
                {PowerPlant.Plant_annual_net_generation__MWh_} Megawatt Hours
              </span>
            </div>
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
