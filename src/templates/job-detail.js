import React from "react"
import { graphql, Link } from "gatsby"
import { Row, Col } from "react-bootstrap"

import Layout from "../components/layout"
import SEO from "../components/seo"
import JobDetail from "../components/jobdetail"

const JobDetailPage = ({data}) => {
  const jobData = data.allOccupationsJson.nodes[0]

  return (
    <Layout>
      <SEO title={jobData.occupation} />
      <Row>
        <Col>
          <p><Link to="/">&laquo; Back to all occupations</Link></p>
          <h3>
            {jobData.occupation}
          </h3>
          <p><Link to={`/compare?job1=${jobData.occupation_slug}`}>Compare to other occupations &raquo;</Link></p>
          <JobDetail jobData={jobData} />
        </Col>
      </Row>
      
    </Layout>
  )
}

export default JobDetailPage

export const query = graphql`
  query JobDetailQuery(
    $pagePath: String!
  ) {
    allOccupationsJson(
      filter: {occupation_slug: {eq: $pagePath}}
      sort: {fields: occupation}
    ) {
      nodes {
        occupation
        occupation_slug
        total_employed
        green_job
        perc_women
        perc_white
        perc_black_aa
        perc_hispanic_latino
        perc_asian
        perc_other
        perc_union
        weekly_earnings
        education
        experience
        training
        age_16_19
        age_20_24
        age_25_34
        age_35_44
        age_45_54
        age_55_64
        age_65_plus
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
      }
    }
  }
`
