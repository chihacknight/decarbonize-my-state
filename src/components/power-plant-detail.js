import Layout from "./layout"
import SEO from "../components/seo"

const PowerPlantDetailPage = ({ data }) => {
  const {
    slug,
    Latitude,
    Longitude,
    Plant_annual_CH4_emissions__lbs_: poundsCH4,
    Plant_annual_CO2_emissions__tons_: tonsCO2,
    Plant_annual_CO2_equivalent_emissions__tons_: tonsEquivalentCO2,
    Plant_annual_N2O_emissions__lbs_: poundsN2O,
    Plant_annual_NOx_emissions__tons_: tonsNOx,
    Plant_annual_SO2_emissions__tons_: tonsSO2,
    Plant_annual_net_generation__MWh_: netMWH,
    capacity_mw,
    county,
    fossil_fuel_category,
    plant_name,
    utility_name,
  } = data.allPowerPlantsJSON.edges[0].node.power_plants[0]

  console.log(data)
  console.log(slug)

  return (
    <Layout>
      <SEO>
        title={`${placeTitle} | Decarb My State`}
        description={descriptionText}
      </SEO>
      <div style={{ backgroundColor: "red" }}>
        <p>{slug}</p>
      </div>
    </Layout>
  )
}

export default PowerPlantDetailPage

export const query = graphql`
  query PowerPlantQuery {
    allPowerPlantsJson(
      filter: { power_plants: { elemMatch: { slug: { eq: "allen" } } } }
    ) {
      edges {
        node {
          power_plants {
            slug
            Latitude
            Longitude
            Plant_annual_CH4_emissions__lbs_
            Plant_annual_CO2_emissions__tons_
            Plant_annual_CO2_equivalent_emissions__tons_
            Plant_annual_N2O_emissions__lbs_
            Plant_annual_NOx_emissions__tons_
            Plant_annual_SO2_emissions__tons_
            Plant_annual_net_generation__MWh_
            capacity_mw
            county
            fossil_fuel_category
            plant_name
            utility_name
          }
        }
      }
    }
  }
`
