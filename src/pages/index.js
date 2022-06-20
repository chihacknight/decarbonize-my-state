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
  const barChartData = getLatestUsData(cleanData)[0]

  // Prep data for choropleth map
  const mapData = getLatestEmissions(cleanData)

  const stateSlugs = Object.keys(mapData)

  // TODO: Extract currentYear and cutPerYearPrcnt to common place
  const currentYear = new Date().getFullYear()

  // We want to get to 0 by 2050 and we use our current emissions as a start,
  // so the % to cut by is 100 divided by the number of years we have
  const cutPerYearPrcnt = (100 / (2050 - currentYear)).toFixed(1)
  
  return (
    <Layout>
      <SEO title="What does it take to decarbonize your state?" 
        description={`To get to zero by 2050, the US must cut climate pollution by ${cutPerYearPrcnt}% a year.`}
        />
      <div className="main-header">
        <h1 id="main" className='display-4 text-center font-weight-bold'>
          What does it take to <br className="d-none d-lg-block"/>
          decarbonize your state?
        </h1>
        <p className="h3 text-center mt-4">
          The answer is less complicated than you think.
        </p>
      </div>

      <hr></hr>

      <p className="h1 mt-6 mb-5 text-center main-phrase">
        To get to <strong>zero</strong> by
        2050, the US must <br className="d-none d-lg-block" />
        cut climate pollution by <strong>{cutPerYearPrcnt}% a year.</strong>
      </p>

      <h2 className="h4 font-weight-bold">Total US Emissions</h2>
      <p className="h6">
        Million metric tons of CO<sub>2</sub> equivalent (MMTCO2e) emissions
      </p>
      <SimpleAreaChart emissions_data={emissionsOverTime}/>

      <p className='h2 text-center mt-7 mb-5'>
        To do that (and solve the climate crisis) there's one main thing
      </p>

      <div className="electrication-cont d-flex justify-content-center mt-7">
        {/* Desktop only graph */}
        <div className="d-none d-md-block">
          <SingleBarChart emissionsData={barChartData} homeView={true} />
        </div>
        {/* Mobile only graph */}
        <div className="d-md-none">
          <SingleBarChart emissionsData={barChartData} homeView={true} mobileView={true} />
        </div>

        <div className="ml-3 ml-md-5">
          <p className="h1 font-weight-boldest mt-6 mb-7">
            Clean <br/> Electrification!
          </p>

          <p className="h3">...and then there's everything else</p>
        </div>
      </div>

      <p className="h1 text-center mt-8 font-weight-bold main-phrase">
        The levers of change are at the
        state level, <br className="d-none d-lg-block" />
        and each state is different.
      </p>

      <p className="text-center mt-5 mb-5">
        Click on your state to see what it takes to decarbonize by 2050
      </p>

      <div className="mb-md-5">
        <ChoroplethMap emissions={mapData} />
      </div>

      {/* Show list of states on mobile */}
      <div className="d-lg-none">
        <h2 className="h4 font-weight-bold mt-5 mb-3">Browse by State</h2>

        <StatesList stateSlugs={stateSlugs}/>
      </div>
    </Layout>
  )
}

function StatesList ({ stateSlugs }) {
  // Sort slugs A-Z
  stateSlugs.sort()

  function slugToTitle (slug) {
    return slug
      .replaceAll('_', ' ')
      // .replace(/_/g, ' ')
      .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }

  return (
    <ul className="state-links">
      {
        stateSlugs.map(slug =>
          <li key={slug}>
            <a href={`/${slug}`}
              className="btn btn-light">{slugToTitle(slug)}</a>
          </li>
        )
      }
    </ul>
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
