import React from "react"
import { BarChart, Bar, XAxis, YAxis, LabelList, CartesianGrid } from "recharts"

const getLabel=(props, label) => { return label }

export default function SingleBarChart ({emissions_data}) {
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
      <YAxis
        axisLine={false}
        tickLine={false}
        label={{
          angle: -90,
          value: "CO2 (million metric tons)",
          position: "insideBottomLeft"
        }}
      />
      <Bar dataKey="dumps_farms_industrial_other" stackId="a" fill="#98886c">
        <LabelList content={props => getLabel(props, 'Dumps, Farms, Industrial & Other')} position="insideTopLeft" /> 
      </Bar>
      <Bar dataKey="transportation" stackId="a" fill="#b7b7b7">
        <LabelList content={props => getLabel(props, 'Transportation')} position="insideTopLeft" /> 
      </Bar>
      <Bar dataKey="buildings" stackId="a" fill="#d9d9d9">
        <LabelList content={props => getLabel(props, 'Buildings')} position="insideTopLeft" />
      </Bar>
      <Bar dataKey="dirty_power" stackId="a" fill="#f3f3f3">
        <LabelList content={props => getLabel(props, 'Dirty Power')} position="insideTopLeft" />
      </Bar>
    </BarChart>
  )
}