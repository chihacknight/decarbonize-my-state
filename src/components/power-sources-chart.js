import React from "react"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

import { getShortCitation } from "../constants/source-citations"

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
      name: "Hydropower",
      value: latestGeneration.hydro_electric_percent,
    },
    {
      name: "Nuclear",
      value: latestGeneration.nuclear_percent,
    },
    {
      name: "Wind",
      value: latestGeneration.wind_percent,
    },
    {
      name: "Coal",
      value: latestGeneration.coal_percent,
    },
    {
      name: "Natural Gas",
      value: latestGeneration.natural_gas_percent,
    },
    {
      name: "Petroleum",
      value: latestGeneration.petro_liquids_percent,
    },
  ]

  // Filter out totally unused power sectors to prevent breaking padding angle
  // and sort by largest power sector first, which helps keep small sectors on
  // the right (e.g. in Nevada) where they won't collide
  chartData = chartData
    .filter(data => data.value > 0)
    .sort((a, b) => a.value - b.value)

  const totalCleanPercent = latestGeneration.all_solar_percent +
    latestGeneration.hydro_electric_percent +
    latestGeneration.nuclear_percent +
    latestGeneration.wind_percent

  const totalDirtyPercent = 100 - totalCleanPercent

  const RADIAN = Math.PI / 180

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    // How far out the label should be
    const LabelRadiusMult = 1.6
    const radius = innerRadius + (outerRadius - innerRadius) * LabelRadiusMult
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const slicePercent = chartData[index].value

    // Align text to end if left of the chart, center if in the middle, and
    // align start if to the right of the chart
    const textAnchor = x > cx ? "start" : "end"

    if (slicePercent > 0) {
      return (
        <text
          x={x}
          y={y}
          textAnchor={textAnchor}
          width={80}
          dominantBaseline="central"
        >
          {`${chartData[index].name} (${slicePercent}%)`}
        </text>
      )
    } else {
      return null
    }
  }

  return (
    <div>
      <div className="power-sources-chart">
        <ResponsiveContainer>
          <PieChart width="400" height="400">
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={"58%"}
              outerRadius={"75%"}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>

            {/* Inner pie chart shows what power sources are green or dirty */}
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              innerRadius={"52%"}
              outerRadius={"56%"}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>

            <text x={'50%'} y={'48%'}
              width={100}
              dominantBaseline="central"
              textAnchor="middle"
              className="inner-label -prcnt">
              { totalCleanPercent }%
            </text>

            <text x={'50%'} y={'58%'}
              width={100}
              textAnchor="middle"
              className="inner-label">
              Carbon-Free
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <span className="text-secondary keyText">
        Source: {getShortCitation("power-generation")}
      </span>
    </div>
  )
}

export default React.memo(PowerSourcesChart)
