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
  const us_emissions = data.finalJson["united_states"]
  
  // prep data for choropleth map
  const emissions_2018 = get_2018_emissions(data)

  // TODO: Extract currentYear and cutPerYearPrcnt to common place
  const currentYear = new Date().getFullYear()

  // We want to get to 0 by 2050 and we use our current emissions as a start,
  // so the % to cut by is 100 divided by the number of years we have
  const cutPerYearPrcnt = (100 / (2050 - currentYear)).toFixed(1)

  return (
    <Layout>
      <SEO title="What does it take to decarbonize your state?" />

      <div className="main-header">
        <h1 className='h1 text-center'>
          What does it take to decarbonize your state?
        </h1>
        <p className="h5 text-center mt-4">
          It's easier than you think!
        </p>
      </div>

      <hr></hr>

      <p className="h1 mt-5 mb-5 text-center">
        To get to <strong>zero</strong> by 2050, the US must cut climate
        pollution by <strong>{cutPerYearPrcnt} a year.</strong>
      </p>

      <StackedBarChart emissions_data={us_emissions}/>

      <p className='h2 text-center mt-5 mb-5'>
        When it comes to solving the climate crisis there's one main thing
      </p>

      <div className="d-flex align-items-center">
        <div className="h2">
          [stacked bar graph of emissions source]
        </div>

        <div className="ml-5">
          <p className="h3 font-weight-bold mt-5 mb-5">
            CLEAN ELECTRIFICATION
          </p>

          <p>...and then there's everything else</p>
        </div>
      </div>


      <p className="h2 text-center mt-5">
        The levers of change are at the state level and each state is different
      </p>

      <p className="text-center mt-2 mb-5">
        Click on your state to see what it takes to decarbonize by 2050
      </p>

      <ChoroplethMap emissions={emissions_2018} />
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
