import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
import { Typeahead } from "react-bootstrap-typeahead"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ChoroplethMap from "../components/choroplethmap"
import stateValues from "../components/statevalues"
import occupation_json from '../../static/initial_occupations.json'


const IndexPage = ({data}) => {
  // filter out occupations that have no state data
  const occupations = data.allOccupationsJson.nodes.filter((occ) => {
    const allValues = stateValues(occ)
    const allNums = allValues.filter(v => typeof v !== "string")
    return allNums.some(num => typeof num === "number")
  })

  const [occupation,setOccupation] = useState(null)
  
  useEffect(() => {
    const homeOccupations = occupations.filter(occupation =>
      occupation_json.occupations.includes(occupation.occupation_slug))

    const randomIndex = Math.floor(Math.random() * homeOccupations.length)
    setOccupation(homeOccupations[randomIndex])
  },[])

  return (
    <Layout>
      <SEO title="What does it take to decarbonize your state?" />

      <h3 className='text-center'>
        <strong>
        What does it take to decarbonize your state?<br />
        </strong>
      </h3><br />

      <Typeahead
        clearButton
        highlightOnlyResult
        selected={occupations.filter(o => {
          if (occupation) {
            return o.occupation_slug === occupation.occupation_slug
          } else {
            return null
          }
        })}
        id="map-occupation"
        placeholder="Search by occupation ..."
        options={occupations}
        labelKey={(option) => `${option.occupation}`}
        size="large"
        onChange={(option) => {
          if (option !== undefined) {
            if (option.length === 0) {
              setOccupation(null)
            } else {
              setOccupation(option[0])
            }
          }
        }}
      />
      <p class='pt-4'></p>
      <ChoroplethMap occupation={occupation} />
      <br /><br />
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexQuery {
    finalJson {
      buildings {
        _xAlabamaxxx1990x
      }
    }
  }
`
