import "./styles.css";
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

/*Sample emissions_data to show data structure
componsent is currently written for the specific case and not
the general case.  Data MUST be in this format!
*/
const emissions_data = [
  {
    buildings: [50.2, "Buildings"],
    dirty_power: [34.7, "DirtyPower"],
    dumps_farms_industrial_other: [141.5, "Dumps, Farms, Other"],
    transportation: [50.3, "Transportation"]
  }
];

// Determine total and category percentages
var total = emissions_data[0].buildings[0] + emissions_data[0].dirty_power[0];
total =
  total +
  emissions_data[0].dumps_farms_industrial_other[0] +
  emissions_data[0].transportation[0];

emissions_data[0].buildings[1] = emissions_data[0].buildings[1] + " " +
  Math.round((100 * emissions_data[0].buildings[0]) / total) + "%";

emissions_data[0].dirty_power[1] = emissions_data[0].dirty_power[1] + " " +
  Math.round((100 * emissions_data[0].dirty_power[0]) / total) + "%";

emissions_data[0].dumps_farms_industrial_other[1] = emissions_data[0].dumps_farms_industrial_other[1] + " " +
  Math.round((100 * emissions_data[0].dumps_farms_industrial_other[0]) / total) + "%";

emissions_data[0].transportation[1] = emissions_data[0].transportation[1] + " " +
  Math.round((100 * emissions_data[0].transportation[0]) / total) + "%";

//Render the stacked bar.
  export default function App() {
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
        dataKey="dumps_farms_industrial_other[0]"
        stackId="a"
        fill={barColors[0]}
      >
        <LabelList
          dataKey="dumps_farms_industrial_other[1]"
          position="insideTopLeft"
        />
      </Bar>
      <Bar dataKey="transportation[0]" stackId="a" fill={barColors[1]}>
        <LabelList dataKey="transportation[1]" position="insideTopLeft" />
      </Bar>
      <Bar dataKey="buildings[0]" stackId="a" fill={barColors[2]}>
        <LabelList dataKey="buildings[1]" position="insideTopLeft" />
      </Bar>
      <Bar dataKey="dirty_power[0]" stackId="a" fill={barColors[3]}>
        <LabelList dataKey="dirty_power[1]" position="insideTopLeft" />
      </Bar>
    </BarChart>
  );
}