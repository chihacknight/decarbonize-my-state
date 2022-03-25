import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import StackedBarChart from "../components/stackedbar"
import ChoroplethMap from "../components/choroplethmap"
import get_2018_emissions from "../components/get_2018_emissions"


const IndexPage = ({data}) => {
  // console.log(data.finalJson)
  // prep data for US bar chart
  const us_emissions = data.emissionsJson["united_states"]
  
  // prep data for choropleth map
  const emissions_2018 = get_2018_emissions(data.emissionsJson)

  return (
    <Layout>
      <SEO title="What does it take to decarbonize your state?" />

      <h2 className='text-center'>
        <strong>
        We have 28 years to reduce our emissions to zero<br />
        </strong>
      </h2><br />

      <StackedBarChart emissions_data={us_emissions}/>
      <br /><br /><br />
      <h2 className='text-center'>
        <strong>
        What does it take to decarbonize your state?<br />
        </strong>
      </h2><br />

      <p className='pt-4'></p>
      <ChoroplethMap emissions={emissions_2018} />
      <br /><br />
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
query IndexQuery {
  emissionsJson {
    alabama {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    alaska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    arizona {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    arkansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    california {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    colorado {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    connecticut {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    delaware {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    district_of_columbia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    florida {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    georgia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    hawaii {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    idaho {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    illinois {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    indiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    iowa {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    kansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    kentucky {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    louisiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    maine {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    maryland {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    massachusetts {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    michigan {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    minnesota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    mississippi {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    missouri {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    montana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    nebraska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    nevada {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_hampshire {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_jersey {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_mexico {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_york {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    north_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    north_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    ohio {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    oklahoma {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    oregon {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    pennsylvania {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    rhode_island {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    south_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    south_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    tennessee {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    texas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    united_states {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    utah {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    vermont {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    washington {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    west_virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    wisconsin {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    wyoming {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
  }
}
`
