import React from "react"
import { graphql, navigate } from "gatsby"
import Select from "react-select"
import { Row, Col, Table } from "react-bootstrap"
import "url-search-params-polyfill"

import Layout from "../components/layout"
import SEO from "../components/seo"
import JobDetail from "../components/jobdetail"

class ComparePage extends React.Component {
  constructor (props) {
    super(props)

    var jobOptions = []
    props.data.allOccupationsJson.nodes.forEach(record => {
      jobOptions.push(
        {value: record.occupation_slug, label: record.occupation}
      )
    })

    this.state = {
      jobOptions: jobOptions,
      job1: '',
      job2: ''
    }
  }

  componentDidMount () {
    this.getValueFromQueryString("job1")
    this.getValueFromQueryString("job2")
  }

  getValueFromQueryString (name) {
    let searchParams = new URLSearchParams(this.props.location.search)
    const newValueSlug = searchParams.get(name)
    
    if (newValueSlug) {
      const inputValue = this.props.data.allOccupationsJson.nodes.filter(option => {
        return option.occupation_slug === newValueSlug
      })[0]

      this.setState({
        [name]: inputValue
      })
    }
  }

  getQueryString (newKey, newValue) {
    let searchParams = new URLSearchParams(this.props.location.search)
    if (searchParams) {
      if (searchParams.has(newKey)) {
        searchParams.set(newKey, newValue.occupation_slug)
      } else {
        searchParams.append(newKey, newValue.occupation_slug)
      }
    }
    const queryString = `?${searchParams.toString()}`
    return queryString
  }

  handleChange (name, event) {
    const selectedJob = this.props.data.allOccupationsJson.nodes.filter(
      d => d.occupation_slug === event.value
    )[0]

    const qs = this.getQueryString(name, selectedJob)
    navigate(qs)

    this.setState({
      [name]: selectedJob
    })
  }

  render () {
    return (
      <Layout>
        <SEO title="Compare occupations" />
        <h3>Compare occupations</h3>
        <br />
        { !this.state.job1 || !this.state.job2 ?  
          <h5 className="text-center">Select two occupations from the drop down menus below for a side-by-side comparison</h5>
          : null
        }
        <Row style={{ marginTop: '1rem' }}>
          <Col sm={12}>
            <Table>
              <tbody>
                <tr>
                  <td></td>
                  <td style={{ width: '40%' }}>
                    <Select
                      name="job1"
                      options={this.state.jobOptions}
                      onChange={this.handleChange.bind(this, 'job1')}
                      value={this.state.jobOptions.filter(option => option.value === this.state.job1.occupation_slug)}
                    /> 
                  </td>
                  <td style={{ width: '40%' }}>
                    <Select
                      name="job2"
                      options={this.state.jobOptions}
                      onChange={this.handleChange.bind(this, 'job2')}
                      value={this.state.jobOptions.filter(option => option.value === this.state.job2.occupation_slug)}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col>
            <JobDetail jobData={this.state.job1} jobData2={this.state.job2} compare={true} />
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default ComparePage

export const query = graphql`
  query CompareQuery {
    allOccupationsJson(sort: {fields: occupation}) {
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
      }
    }
  }
`
