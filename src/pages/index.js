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
  const us_emissions = data.finalJson["United_States"]
  
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
    Alabama {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Alaska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Arizona {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Arkansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    California {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Colorado {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Connecticut {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Delaware {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    District_Of_Columbia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Florida {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Georgia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Hawaii {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Idaho {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Illinois {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Indiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Iowa {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Kansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Kentucky {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Louisiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Maine {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Maryland {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Massachusetts {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Michigan {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Minnesota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Mississippi {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Missouri {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Montana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Nebraska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Nevada {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_Hampshire {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_Jersey {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_Mexico {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_York {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    North_Carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    North_Dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Ohio {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Oklahoma {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Oregon {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Pennsylvania {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Rhode_Island {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    South_Carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    South_Dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Tennessee {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Texas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    United_States {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Utah {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Vermont {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Washington {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    West_Virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Wisconsin {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Wyoming {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
  }
}
`
