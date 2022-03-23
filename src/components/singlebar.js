import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  CartesianGrid
} from "recharts";

const barColors = ["#685e4a", "#b7b7b7", "#d9d9d9", "#f3f3f3"];

function getTotal (payload) {
  return payload[0].value + payload[1].value + payload[2].value + payload[3].value
}

function calcPercent (payload, index) {
  return (100 * payload[index].value.toFixed(1) / getTotal(payload)).toFixed(1)
}

// const renderLabel = (props, text) =>{
//   const { x, y, width, height, value } = props
//   return (
//     <span>{text}: {value}</span>
//     )
// }

const getLabel=(props, label) => {return  label}


//Render the stacked bar.
  export default function SingleBarChart({emissions_data}) {
  return (
    <BarChart
      barSize={250}
      width={500}
      height={300}
      data={emissions_data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="0 99" />
      <XAxis dataKey=" " hide={true} />
      <YAxis
        axisLine={false}
        tickLine={false}
        label={{
          angle: -90,
          value: "CO2 (million metric tons)",
          position: "insideBottomLeft"
        }}
      />
      <Bar
        dataKey="dumps_farms_industrial_other"
        stackId="a"
        fill={barColors[0]}
      >
         <LabelList
          content={props => getLabel(props, 'Dumps, Farms, Industrial & Other')}
          position="insideTopLeft"
        /> 
      </Bar>
     <Bar dataKey="transportation" stackId="a" fill={barColors[1]}>
        <LabelList 
        content={props => getLabel(props, 'Transportation')}
        position="insideTopLeft" /> 
      </Bar>
       <Bar dataKey="buildings" stackId="a" fill={barColors[2]}>
        <LabelList content={props => getLabel(props, 'Buildings')} position="insideTopLeft" />
      </Bar>
      <Bar dataKey="dirty_power" stackId="a" fill={barColors[3]}>
        <LabelList content={props => getLabel(props, 'Dirty Power')} position="insideTopLeft" />
      </Bar>
    </BarChart>
  );
}