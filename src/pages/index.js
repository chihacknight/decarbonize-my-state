import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
import { Typeahead } from "react-bootstrap-typeahead"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ChoroplethMap from "../components/choroplethmap"
import JobTable from "../components/jobtable"
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
      <JobTable
        data={data}
      />
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexQuery {
    allOccupationsJson(sort: {fields: occupation}) {
      nodes {
        alabama_concentration
        alaska_concentration
        arizona_concentration
        arkansas_concentration
        california_concentration
        colorado_concentration
        connecticut_concentration
        delaware_concentration
        district_of_columbia_concentration
        florida_concentration
        georgia_concentration
        guam_concentration
        hawaii_concentration
        idaho_concentration
        illinois_concentration
        indiana_concentration
        iowa_concentration
        kansas_concentration
        kentucky_concentration
        louisiana_concentration
        maine_concentration
        maryland_concentration
        massachusetts_concentration
        michigan_concentration
        minnesota_concentration
        mississippi_concentration
        missouri_concentration
        montana_concentration
        nebraska_concentration
        nevada_concentration
        new_hampshire_concentration
        new_jersey_concentration
        new_mexico_concentration
        new_york_concentration
        north_carolina_concentration
        north_dakota_concentration
        ohio_concentration
        oklahoma_concentration
        oregon_concentration
        pennsylvania_concentration
        puerto_rico_concentration
        rhode_island_concentration
        south_carolina_concentration
        south_dakota_concentration
        tennessee_concentration
        texas_concentration
        utah_concentration
        vermont_concentration
        virgin_islands_concentration
        virginia_concentration
        washington_concentration
        west_virginia_concentration
        wisconsin_concentration
        wyoming_concentration
        alabama_perthousand
        alaska_perthousand
        arizona_perthousand
        arkansas_perthousand
        california_perthousand
        colorado_perthousand
        connecticut_perthousand
        delaware_perthousand
        district_of_columbia_perthousand
        florida_perthousand
        georgia_perthousand
        guam_perthousand
        hawaii_perthousand
        idaho_perthousand
        illinois_perthousand
        indiana_perthousand
        iowa_perthousand
        kansas_perthousand
        kentucky_perthousand
        louisiana_perthousand
        maine_perthousand
        maryland_perthousand
        massachusetts_perthousand
        michigan_perthousand
        minnesota_perthousand
        mississippi_perthousand
        missouri_perthousand
        montana_perthousand
        nebraska_perthousand
        nevada_perthousand
        new_hampshire_perthousand
        new_jersey_perthousand
        new_mexico_perthousand
        new_york_perthousand
        north_carolina_perthousand
        north_dakota_perthousand
        ohio_perthousand
        oklahoma_perthousand
        oregon_perthousand
        pennsylvania_perthousand
        puerto_rico_perthousand
        rhode_island_perthousand
        south_carolina_perthousand
        south_dakota_perthousand
        tennessee_perthousand
        texas_perthousand
        utah_perthousand
        vermont_perthousand
        virgin_islands_perthousand
        virginia_perthousand
        washington_perthousand
        west_virginia_perthousand
        wisconsin_perthousand
        wyoming_perthousand
        alabama
        alaska
        arizona
        arkansas
        california
        colorado
        connecticut
        delaware
        district_of_columbia
        florida
        georgia
        guam
        hawaii
        idaho
        illinois
        indiana
        iowa
        kansas
        kentucky
        louisiana
        maine
        maryland
        massachusetts
        michigan
        minnesota
        mississippi
        missouri
        montana
        nebraska
        nevada
        new_hampshire
        new_jersey
        new_mexico
        new_york
        north_carolina
        north_dakota
        ohio
        oklahoma
        oregon
        pennsylvania
        puerto_rico
        rhode_island
        south_carolina
        south_dakota
        tennessee
        texas
        utah
        vermont
        virgin_islands
        virginia
        washington
        west_virginia
        wisconsin
        wyoming
        occupation
        occupation_slug
        green_job
        perc_women
        perc_white
        perc_black_aa
        perc_hispanic_latino
        perc_asian
        weekly_earnings
        total_employed
      }
    } totalsJson {
      alabama
      alaska
      arizona
      arkansas
      california
      colorado
      connecticut
      delaware
      district_of_columbia
      florida
      georgia
      guam
      hawaii
      idaho
      illinois
      indiana
      iowa
      kansas
      kentucky
      louisiana
      maine
      maryland
      massachusetts
      michigan
      minnesota
      mississippi
      missouri
      montana
      nebraska
      nevada
      new_hampshire
      new_jersey
      new_mexico
      new_york
      north_carolina
      north_dakota
      ohio
      oklahoma
      oregon
      pennsylvania
      puerto_rico
      rhode_island
      south_carolina
      south_dakota
      tennessee
      texas
      utah
      vermont
      virgin_islands
      virginia
      washington
      west_virginia
      wisconsin
      wyoming
    }
  }
`
