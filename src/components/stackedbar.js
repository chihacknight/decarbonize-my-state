import React from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const StackedBarChart = ({emissions_data}) => {

  if (emissions_data) {
    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          width={500}
          height={300}
          data={emissions_data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="dirty_power" name="Dirty power" stackId="a" fill="#e41a1c" />
          <Bar dataKey="buildings" name="Buildings" stackId="a" fill="#377eb8" />
          <Bar dataKey="transportation" name="Transportation" stackId="a" fill="#4daf4a" />
          <Bar dataKey="dumps_farms_industrial" name="Dumps, farms, industrial" stackId="a" fill="#984ea3" />
        </BarChart>
      </ResponsiveContainer>
    )
  }
  else {
    return (
      <span class='float-right'>Data not available</span>
    )
  }
}

export default StackedBarChart
