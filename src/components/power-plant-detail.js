import React from "react"
import { graphql } from "gatsby"

import Layout from "./layout"
import SEO from "./seo"

// Sim city power plant icons
import OilPlantImg from "../images/oil-plant.png"
import GasPlantImg from "../images/gas-plant.png"
import CoalPlantImg from "../images/coal-plant.png"

import NewTabIcon from "../components/new-tab-icon"

const PowerPlantDetailPage = ({ pageContext, data }) => {
  console.log('data', data);
  const PowerPlantState = data.allPowerPlantsJson.edges[0].node.state;
  const PowerPlant = data.allPowerPlantsJson.edges[0].node.power_plants.find(
    plant => plant.slug === pageContext.powerPlantSlug
  )

  // t=k sets the map to sattelite view, then we specify a query of  Lat,Long
  const GoogleMapsLink = `https://maps.google.com/?t=k&q=${PowerPlant.Latitude},${PowerPlant.Longitude}`

  return (
    <Layout>
      <SEO title={PowerPlant.plant_name + " Power Plant | Decarb My State"} />

      <div className="power-plant-page">
        <div>
          <div className="top-row d-flex align-items-center">
            { PowerPlant.fossil_fuel_category.toLowerCase() === 'oil' &&
              <img src={OilPlantImg} alt="Oil power plant" /> }
            { PowerPlant.fossil_fuel_category.toLowerCase() === 'gas' &&
              <img src={GasPlantImg} alt="Gas power plant" /> }
            { PowerPlant.fossil_fuel_category.toLowerCase() === 'coal' &&
              <img src={CoalPlantImg} alt="Coal power plant" /> }

            <div>
              <h1 id="main" className="mb-0">{PowerPlant.plant_name}</h1>

              <div className="h5 mb-0 font-weight-bold">
                <span className="text-capitalize">
                  {PowerPlant.fossil_fuel_category.toLowerCase()}
                </span> Power Plant
              </div>
              <div>
                {PowerPlant.county} County, <span className="text-capitalize">{PowerPlantState}</span>
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
            </div>
          </div>

          <dl>
            <dt>Capacity</dt>
            <dd>{PowerPlant.capacity_mw} Megawatts</dd>

            <dt>Annual Net Generation</dt>
            <dd>
              {PowerPlant.Plant_annual_net_generation__MWh_}
              &nbsp;MWh (Megawatt Hours)
            </dd>

            <dt>Annual CO<sub>2</sub>e emissions</dt>
            <dd>
              {PowerPlant.Plant_annual_CO2_equivalent_emissions__tons_}
              &nbsp;metric tons CO<sub>2</sub> equivalent
            </dd>

            <dt>Annual CO<sub>2</sub> emissions</dt>
            <dd>
              {PowerPlant.Plant_annual_CO2_emissions__tons_}
              &nbsp;metrics tons CO<sub>2</sub>
            </dd>

            <dt>Annual SO<sub>2</sub> (Sulfer Dioxide) emissions</dt>
            <dd>{PowerPlant.Plant_annual_SO2_emissions__tons_} tons</dd>

            <dt>Annual NOx (Nitrogen Oxide) emissions</dt>
            <dd>{PowerPlant.Plant_annual_NOx_emissions__tons_} tons</dd>

            <dt>Annual N<sub>2</sub>O (Nitrous Oxide) emissions</dt>
            <dd>{PowerPlant.Plant_annual_N2O_emissions__lbs_} lbs</dd>

            <dt>Annual CH4 (Methane) emissions</dt>
            <dd>{PowerPlant.Plant_annual_CH4_emissions__lbs_} lbs</dd>
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
