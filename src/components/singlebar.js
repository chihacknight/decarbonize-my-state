import React from "react"
import { BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid } from "recharts"

const getPct = (value, total) => { return Math.round((value/total)*100) }
const getLabel = (entry, total, field, label) => { return `${label}: ${getPct(entry[field], total)}%` }

export default function SingleBarChart ({emissions_data}) {
  // sum all emissions fields except year
  const totalEmissions = Object.entries(emissions_data[0])
    .filter(([key,_val]) => key !== 'year')
    .reduce((acc, [_key,val]) => acc + val, 0)

  return (
    <BarChart
      barSize={250}
      width={500}
      height={600}
      data={emissions_data}
      margin={{
        top: 0,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="0 99" />
      <Bar dataKey="dumps_farms_industrial_other" stackId="a" fill="#98886c">
        <LabelList valueAccessor={entry => getLabel(entry, totalEmissions, 'dumps_farms_industrial_other', 'Dumps, Farms, Industrial & Other')} position="insideTopLeft" /> 
      </Bar>
      <Bar dataKey="transportation" stackId="a" fill="#b7b7b7">
        <LabelList valueAccessor={entry => getLabel(entry, totalEmissions, 'transportation', 'Transportation')} position="insideTopLeft" /> 
      </Bar>
      <Bar dataKey="buildings" stackId="a" fill="#d9d9d9">
        <LabelList valueAccessor={entry => getLabel(entry, totalEmissions, 'buildings', 'Buildings')} position="insideTopLeft" />
      </Bar>
      <Bar dataKey="dirty_power" stackId="a" fill="#f3f3f3">
        <LabelList valueAccessor={entry => getLabel(entry, totalEmissions, 'dirty_power', 'Dirty Power')} position="insideTopLeft" />
      </Bar>
    </BarChart>
  )
}