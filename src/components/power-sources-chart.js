import React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

/**
 * A pie chart that shows the sources of power generation for a given state.
 *
 * @param placeTitle {string} The name of the state
 *
 * @param latestGeneration An object with the following keys:
 *
 * {
 *   all_solar_percent: number;
 *   coal_percent: number;
 *   hydro_electric_percent: number;
 *   natural_gas_percent: number;
 *   nuclear_percent: number;
 *   petro_liquids_percent: number;
 *   wind_percent: number;
 *   year: number;
 * }
 */
const PowerSourcesChart = ({ placeTitle, latestGeneration }) => {
  let chartData = [
    {
      name: "Solar",
      value: latestGeneration.all_solar_percent,
    },
    {
      name: "Coal",
      value: latestGeneration.coal_percent,
    },
    {
      name: "Hydropower",
      value: latestGeneration.hydro_electric_percent,
    },
    {
      name: "Natural Gas",
      value: latestGeneration.natural_gas_percent,
    },
    {
      name: "Nuclear",
      value: latestGeneration.nuclear_percent,
    },
    {
      name: "Petroleum",
      value: latestGeneration.petro_liquids_percent,
    },
    {
      name: "Wind",
      value: latestGeneration.wind_percent,
    },
  ]

  // Filter out totally unused power sectors to prevent breaking padding angle
  chartData = chartData.filter(data => data.value > 0)

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const RADIAN = Math.PI / 180

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const roundedPercent = (percent * 100).toFixed(0)

    // Align text to end if left of the chart, center if in the middle, and
    // align start if to the right of the chart
    const textAnchor =
      Math.abs(x - cx) <= 10 ? "middle" : x > cx ? "start" : "end"

    if (roundedPercent > 0) {
      return (
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          width={80}
          dominantBaseline="central"
        >
          {`${chartData[index].name} (${roundedPercent}%)`}
        </text>
      )
    } else {
      return null
    }
  }

  return (
    <div className="power-sources-chart">
      <ResponsiveContainer>
        <PieChart width="400" height="400">
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={"50%"}
            outerRadius={"80%"}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default React.memo(PowerSourcesChart)
