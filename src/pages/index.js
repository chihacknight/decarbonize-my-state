import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import StackedBarChart from "../components/stackedbar"
import ChoroplethMap from "../components/choroplethmap"
import get_2018_emissions from "../components/get_2018_emissions"


const IndexPage = ({data}) => {
  // console.log(data.finalJson)

  // prep data for US bar chart
  const us_emissions = data.finalJson["united_states"]
  
  // prep data for choropleth map
  const emissions_2018 = get_2018_emissions(data)

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
  finalJson {
    alabama {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    alaska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    arizona {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    arkansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    california {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    colorado {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    connecticut {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    delaware {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    district_of_columbia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    florida {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    georgia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    hawaii {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    idaho {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    illinois {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    indiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    iowa {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    kansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    kentucky {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    louisiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    maine {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    maryland {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    massachusetts {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    michigan {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    minnesota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    mississippi {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    missouri {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    montana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    nebraska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    nevada {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_hampshire {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_jersey {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_mexico {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_york {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    north_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    north_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    ohio {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    oklahoma {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    oregon {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    pennsylvania {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    rhode_island {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    south_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    south_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    tennessee {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    texas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    united_states {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    utah {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    vermont {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    washington {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    west_virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    wisconsin {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    wyoming {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
  }
}
`
