import React from "react"
import { intcomma } from "journalize"
import {
  BarChart, Bar, XAxis, ResponsiveContainer, LabelList
} from "recharts"

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

const renderEarningsLabel = (props) => {
  const {
    x, y, width, height, value,
  } = props

  return (
    <g>
      <text x={x + width / 2} y={y - 10} textAnchor="middle" dominantBaseline="middle">
        ${intcomma(value)}/week
      </text>
    </g>
  )
}

const BarChartTwo = ({val, national, isPercent, color}) => {
  const earningsData = [
    {
      name: 'This occupation', value: val, fill: (color ? color : '#2ADB88')
    },
    {
      name: 'National average', value: national, fill: '#CCCCCC'
    }
  ]

  if (val) {
    return (
      <ResponsiveContainer width='100%' height={120}>
        <BarChart
          data={earningsData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="name" />
          <Bar isAnimationActive={false} dataKey="value">
            <LabelList dataKey="value" position="top" content={isPercent ? renderPercentLabel: renderEarningsLabel}/>
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

export default BarChartTwo