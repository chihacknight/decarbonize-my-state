import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 0
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 0
  },
  {
    name: "Page C",
    uv: 2000,
    
  },
  {
    name: "Page D",
    uv: 2000,
    pv: 2000
  
  },
  {
    name: "Page E",
    
    pv: 4800
  },
  {
    name: "Page F",
    
    pv: 3800
  },
  {
    name: "Page G",
    
    pv: 4300
  }
];

export default function SimpleAreaChart() {
  return (
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="uv"
        stackId="1"
        stroke="#8884d8"
        fill="#8884d8"
      />
      <Area
        type="monotone"
        dataKey="pv"
        stackId="2"
        stroke="#82ca9d"
        fill="#82ca9d"
      />
      
    </AreaChart>
  );
}
