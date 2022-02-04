import React from "react"
import { Table } from "react-bootstrap"
import { intcomma } from "journalize"
import {
  BarChart, Bar, XAxis, ResponsiveContainer, LabelList, Legend
} from "recharts"
import ChoroplethMap from "../components/choroplethmap"
import BarChartTwo from "../components/barcharttwo"
import { Link } from "gatsby"
import { FaCheck, FaInfoCircle } from "react-icons/fa"

const renderPercentLabel = (props) => {
  const {
    x, y, width, height, value,
  } = props

  return (
    <g>
      <text x={x + width / 2} y={y - 10} textAnchor="middle" dominantBaseline="middle">
        {value}%
      </text>
    </g>
  )
}

const RaceBarChart = ({jobData}) => {
  const raceData = [
    {
      name: 'White', 
      'This occupation': jobData.perc_white, 
      'National average': 78.0
    },
    {
      name: 'Black', 
      'This occupation': jobData.perc_black_aa, 
      'National average': 12.1
    },
    {
      name: 'Asian', 
      'This occupation': jobData.perc_asian, 
      'National average': 6.4
    },
    {
      name: 'Other', 
      'This occupation': jobData.perc_other, 
      'National average': 3.5
    },
  ]

  if (jobData.perc_white) {
    return (
      <ResponsiveContainer width='100%' height={120}>
        <BarChart
          data={raceData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="name" />
          <Bar dataKey="This occupation" fill='#BF5CC4'>
            <LabelList dataKey="This occupation" position="top" content={renderPercentLabel} />
          </Bar>
          <Bar dataKey="National average" fill='#CCCCCC'>
            <LabelList dataKey="National average" position="top" content={renderPercentLabel} />
          </Bar>
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    )
  } else {
    return (
      <span class='float-right'>Data not available</span>
    )
  }
}

const AgeBarChart = ({jobData}) => {
  const ageData = [
    {
      name: '16-19', value: jobData.age_16_19
    },
    {
      name: '20-24', value: jobData.age_20_24
    },
    {
      name: '25-34', value: jobData.age_25_34
    },
    {
      name: '35-44', value: jobData.age_35_44
    },
    {
      name: '45-54', value: jobData.age_45_54
    },
    {
      name: '65+', value: jobData.age_65_plus
    }
  ]

  if (jobData.age_16_19) {
    return (
      <ResponsiveContainer width='100%' height={120}>
        <BarChart
          data={ageData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="name" />
          <Bar dataKey="value" fill="#EF4C39">
            <LabelList dataKey="value" position="top" content={renderPercentLabel}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  } else {
    return (
      <span class='float-right'>Data not available</span>
    )
  }
}

const JobDetail = ({jobData, jobData2=null, compare=false}) => {
  if ((!compare && jobData) || (jobData && jobData2 && compare)) {
    return (
      <>
        <Table>
          <tbody>
            {jobData2 &&
              <tr>
                <td>Occupation</td>
                <td style={{ width: '40%' }}>
                  <span class='float-right'>
                    <Link to={`/job/${jobData.occupation_slug}`}><strong>{jobData.occupation}</strong></Link>
                  </span>
                </td>
                <td style={{ width: '40%' }}>
                  <span class='float-right'>
                    <Link to={`/job/${jobData2.occupation_slug}`}><strong>{jobData2.occupation}</strong></Link>
                  </span>
                </td>
              </tr>
            }
            <tr>
              <td>Common green job?</td>
              <td>
                <span class='float-right'>
                  {jobData.green_job ? <strong className={ 'sunrise-green' }><FaCheck /> Yes</strong> : 'No'}
                </span>
              </td>
              {jobData2 &&
                <td>
                  <span class='float-right'>
                    {jobData2.green_job ? <strong className={ 'sunrise-green' }><FaCheck /> Yes</strong> : 'No'}
                  </span>
                </td>
              }
            </tr>
            <tr>
              <td>Workers employed in the US</td>
              <td>
                <span class='float-right'>
                  {intcomma(jobData.total_employed)}
                </span>
              </td>
              {jobData2 &&
                <td>
                  <span class='float-right'>
                    {intcomma(jobData2.total_employed)}
                  </span>
                </td>
              }
            </tr>
            <tr>
              <td>Women in this workforce</td>
              <td>
                <div style={jobData2 ? {} : { float: 'right', width: '50%' }}>
                  <BarChartTwo
                    val={jobData.perc_women}
                    national={46.8}
                    isPercent={true}
                    color={'#22CDF4'}
                  />
                </div>
              </td>
              {jobData2 &&
                <td>
                  <BarChartTwo
                    val={jobData2.perc_women}
                    national={46.8}
                    isPercent={true}
                    color={'#22CDF4'}
                  />
                </td>
              }
            </tr>
            <tr>
              <td>Hispanic / Latino workers</td>
              <td>
                <div style={jobData2 ? {} : { float: 'right', width: '50%' }}>
                  <BarChartTwo
                    val={jobData.perc_hispanic_latino}
                    national={17.6}
                    isPercent={true}
                    color={'#1282A0'}
                  />
                </div>
              </td>
              {jobData2 &&
                <td>
                  <BarChartTwo
                    val={jobData2.perc_hispanic_latino}
                    national={17.6}
                    isPercent={true}
                    color={'#1282A0'}
                  />
                </td>
              }
            </tr>
            <tr>
              <td>Workers by race</td>
              <td>
                <RaceBarChart
                  jobData={jobData}
                />
              </td>
              {jobData2 &&
                <td>
                  <RaceBarChart
                    jobData={jobData2}
                  />
                </td>
              }
            </tr>
            <tr>
              <td>Median earnings</td>
              <td>
                <div style={jobData2 ? {} : { float: 'right', width: '50%' }}>
                  <BarChartTwo
                    val={jobData.weekly_earnings}
                    national={917}
                    isPercent={false}
                  />
                </div>
              </td>
              {jobData2 &&
                <td>
                  <BarChartTwo
                    val={jobData2.weekly_earnings}
                    national={917}
                    isPercent={false}
                  />
                </td>
              }
            </tr>
            <tr>
              <td>Concentration of workers by state / territory</td>
              <td>
                <ChoroplethMap occupation={jobData} sidebar={false} />
              </td>
              {jobData2 &&
                <td>
                  <ChoroplethMap occupation={jobData2} sidebar={false} />
                </td>
              }
            </tr>
            <tr>
              <td>Workers by age group</td>
              <td>
                <AgeBarChart
                  jobData={jobData}
                />
              </td>
              {jobData2 &&
                <td>
                  <AgeBarChart
                    jobData={jobData2}
                  />
                </td>
              }
            </tr>
            <tr>
              <td>Typical education needed for entry</td>
              <td>
                <span class='float-right'>
                  {jobData.education ? <span>{jobData.education} <a href="/terminology/#education" target="_blank"><FaInfoCircle /></a></span> : 'Data not available'}
                </span>
              </td>
              {jobData2 &&
                <td>
                  <span class='float-right'>
                    {jobData2.education ? <span>{jobData2.education} <a href="/terminology/#education" target="_blank"><FaInfoCircle /></a></span> : 'Data not available'}
                  </span>
                </td>
              }
            </tr>
            <tr>
              <td>Work experience in a related occupation</td>
              <td>
                <span class='float-right'>
                  {jobData.experience ? <span>{jobData.experience} <a href="/terminology/#experience" target="_blank"><FaInfoCircle /></a></span> : 'Data not available'}
                </span>
              </td>
              {jobData2 &&
                <td>
                  <span class='float-right'>
                    {jobData2.experience ? <span>{jobData2.experience} <a href="/terminology/#experience" target="_blank"><FaInfoCircle /></a></span> : 'Data not available'}
                  </span>
                </td>
              }
            </tr>
            <tr>
              <td>Typical on-the-job training needed to attain competency</td>
              <td>
                <span class='float-right'>
                  {jobData.training ? <span>{jobData.training} <a href="/terminology/#training" target="_blank"><FaInfoCircle /></a></span> : 'Data not available'}
                </span>
              </td>
              {jobData2 &&
                <td>
                  <span class='float-right'>
                    {jobData2.training ? <span>{jobData2.training} <a href="/terminology/#training" target="_blank"><FaInfoCircle /></a></span> : 'Data not available'}
                  </span>
                </td>
              }
            </tr>
            <tr>
              <td>Union representation</td>
              <td>
                <span class='float-right'>
                  {jobData.perc_union ? jobData.perc_union + '%' : 'Data not available'}
                </span>
              </td>
              {jobData2 &&
                <td>
                  <span class='float-right'>
                    {jobData2.perc_union ? jobData2.perc_union + '%' : 'Data not available'}
                  </span>
                </td>
              }
            </tr>
          </tbody>
        </Table>
      </>
    )
  } else {
    return (
      <></>
    )
  }
}

export default JobDetail
