import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SingleBarChart from "../components/singlebar"
import ChoroplethMap from "../components/choroplethmap"
import {getLatestEmissions, getLatestUsData} from "../components/getLatestEmissions"
import SimpleAreaChart from "../components/simpleareachart"

const getCleanData = (data) => {
  let mutableDataObj = {}
  for (let i=0; i<data.allEmissionsJson.edges.length;i++) {
    const stateName = data.allEmissionsJson.edges[i].node.state
    mutableDataObj[stateName] = {
      emissionsByYear: data.allEmissionsJson.edges[i].node.emissionsByYear,
    }
    // pattern for pulling other data, for future reference!
    // const buildingsData = data.allBuildingsJson.edges.find(row => row.node.state === stateName);
    // if (buildingsData) {
    //   mutableDataObj[stateName] = {
    //     ...mutableDataObj[stateName],
    //     ...buildingsData.node
    //   }
    // }
  }
  return mutableDataObj
}

const IndexPage = ({data}) => {
  const cleanData = getCleanData(data)
  // Prep data for emissions over time chart
  const emissionsOverTime = cleanData["united_states"].emissionsByYear

  // Prep data for the SingleBarChart breaking down emissions by category
  const barChartData = getLatestUsData(cleanData)

  // Prep data for choropleth map
  const mapData = getLatestEmissions(cleanData)

  // TODO: Extract currentYear and cutPerYearPrcnt to common place
  const currentYear = new Date().getFullYear()

  // We want to get to 0 by 2050 and we use our current emissions as a start,
  // so the % to cut by is 100 divided by the number of years we have
  const cutPerYearPrcnt = (100 / (2050 - currentYear)).toFixed(1)

  return (
    <Layout>
      <SEO title="What does it take to decarbonize your state?" />

      <div className="main-header">
        <h1 className='display-4 text-center font-weight-bold'>
          What does it take to <br className="d-none d-lg-block"/>
          decarbonize your state?
        </h1>
        <p className="h3 text-center mt-4">
          The answer is less complicated than you think.
        </p>
      </div>

      <hr></hr>

      <p className="h1 mt-5 mb-5 text-center">
        To get to <strong>zero</strong> by
        2050, the US must <br className="d-none d-lg-block" />
        cut climate pollution by <strong>{cutPerYearPrcnt}% a year.</strong>
      </p>
      Total US climate pollution
      <SimpleAreaChart emissions_data={emissionsOverTime}/>

      <p className='h2 text-center mt-7 mb-5'>
        To do that (and solve the climate crisis) there's one main thing
      </p>

      <div className="d-flex justify-content-center mt-7">
        <SingleBarChart emissionsData={barChartData} homeView={true} />

        <div className="ml-5">
          <p className="h1 font-weight-boldest mt-6 mb-7">
            Clean <br/> Electrification!
          </p>

          <p className="h3">...and then there's everything else</p>
        </div>
      </div>

      <p className="h1 text-center mt-7 font-weight-bold">
        The levers of change are at the
        state level, <br className="d-none d-lg-block" />
        and each state is different.
      </p>

      <p className="text-center mt-2 mb-7">
        Click on your state to see what it takes to decarbonize by 2050
      </p>

      <div className="mb-7">
        <ChoroplethMap emissions={mapData} />
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query MyQuery {
    allBuildingsJson {
      edges {
        node {
          buildings
          state
        }
      }
    }
    allEmissionsJson {
      edges {
        node {
          state
          emissionsByYear {
            buildings
            dumps_farms_industrial_other
            dirty_power
            transportation
            year
          }
        }
      }
    }
  }
`