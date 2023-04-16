import React from "react"
import { graphql } from "gatsby"

import Layout from "./layout"
import SEO from "./seo"

import OilPlantImg from "../images/oil-plant.png"
import NewTabIcon from "../components/new-tab-icon"

const PowerPlantDetailPage = ({ pageContext, data }) => {
  const PowerPlant = data.allPowerPlantsJson.edges[0].node.power_plants.find(
    plant => plant.slug === pageContext.powerPlantSlug
  )

  const curState = data.allPowerPlantsJson.edges[0].node.state

  // t=k sets the map to sattelite view, then we specify a query of  Lat,Long
  const GoogleMapsLink = `https://maps.google.com/?t=k&q=${PowerPlant.Latitude},${PowerPlant.Longitude}`

  return (
    <Layout>
      <SEO title={PowerPlant.plant_name + " Power Plant | Decarb My State"} />

      <div className="power-plant-page">
        <img src={OilPlantImg} alt="Oil power plant" />

        <div>
          <h1 id="main">{PowerPlant.plant_name}</h1>

          <div className="fuel-category">
            {PowerPlant.fossil_fuel_category.toLowerCase()} power plant
          </div>

          <a
            href={GoogleMapsLink}
            href="https://communitysolar.energysage.com/"
            target="_blank"
            rel="noreferrer"
          >
            View on Google Maps
            <NewTabIcon />
          </a>

          <dl>
            <dt>County:</dt>
            <dd>{PowerPlant.county}</dd>

            <dt>Capacity:</dt>
            <dd>{PowerPlant.capacity_mw} Megawatts</dd>

            <dt>Plant_annual_net_generation__MWh_</dt>
            <dd>{PowerPlant.Plant_annual_net_generation__MWh_}</dd>

            <dt>Plant_annual_SO2_emissions__tons_</dt>
            <dd>{PowerPlant.Plant_annual_SO2_emissions__tons_}</dd>

            <dt>Plant_annual_NOx_emissions__tons_</dt>
            <dd>{PowerPlant.Plant_annual_NOx_emissions__tons_}</dd>

            <dt>Plant_annual_N2O_emissions__lbs_</dt>
            <dd>{PowerPlant.Plant_annual_N2O_emissions__lbs_}</dd>

            <dt>Plant_annual_CH4_emissions__lbs_</dt>
            <dd>{PowerPlant.Plant_annual_CH4_emissions__lbs_}</dd>

            <dt>Plant_annual_CO2_emissions__tons_</dt>
            <dd>{PowerPlant.Plant_annual_CO2_emissions__tons_}</dd>

            <dt>Plant_annual_CO2_equivalent_emissions__tons_</dt>
            <dd>{PowerPlant.Plant_annual_CO2_equivalent_emissions__tons_}</dd>
          </dl>
        </div>
      </div>
    </Layout>
  )
}

export default PowerPlantDetailPage

export const query = graphql`
  query PowerPlantQuery($powerPlantSlug: String) {
    allPowerPlantsJson(
      filter: { power_plants: { elemMatch: { slug: { eq: $powerPlantSlug } } } }
    ) {
      edges {
        node {
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
          state
        }
      }
    }
  }
`
