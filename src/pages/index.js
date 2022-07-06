import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ChoroplethMap from "../components/choroplethmap"
import {getLatestEmissions} from "../components/getLatestEmissions"

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

  // Prep data for choropleth map
  const mapData = getLatestEmissions(cleanData)

  const stateSlugs = Object.keys(mapData)

  // TODO: Extract currentYear and cutPerYearPrcnt to common place
  const currentYear = new Date().getFullYear()
  
  return (
    <Layout>
      <SEO title="What does it take to decarbonize your state?" />

      <div className="main-header">
        <h1 id="main" className='display-4 text-center font-weight-bold'>
          What does take...</h1>
        <h1 className='display-4 text-center font-weight-bold'>
          to decarb your state?
        </h1>
        <p className="h3 text-center mt-2">
          The answer is simpler than you think.
        </p>
      </div>

      <hr></hr>

      <p className="text-center mt-5 mb-4">
        Click to see how your state will end climate pollution by 2050
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
