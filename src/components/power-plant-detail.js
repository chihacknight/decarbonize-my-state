import React from "react"
import Layout from "./layout"
import SEO from "./seo"
import OilPlantImg from "../images/oil-plant.png"

const PowerPlantDetailPage = ({ pageContext, data }) => {
  const thisPlantDetails = data.allPowerPlantsJson.edges[0].node.power_plants.find(
    plant => plant.slug === pageContext.powerPlantSlug
  )

  return (
    <Layout>
      <SEO title="404: Not Found | Decarb My State" />
      <div className="error-page">
        <img src={OilPlantImg} alt="Oil power plant" />
        <div>
          <h1 className="error-page-h" id="main">
            {thisPlantDetails.plant_name}
          </h1>
          <p className="error-page-p">no</p>
        </div>
        <img src={OilPlantImg} alt="Oil power plant" />
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
        }
      }
    }
  }
`
