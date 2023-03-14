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
  // Start at 12 o'clock and go clockwise, rather than starting at 3 o'clock
  // and going counter clockwise like the default
  const GraphStartAngle = 360 + 90
  const GraphEndAngle = 0 + 90

  // The padding between every power type
  const OuterPaddingAngle = 2

  const GraphMargin = {
    top: 10,
    bottom: 10,
  }

  /**
   * The order here matters, we basically pick our favorites first
   */
  let chartData = [
    {
      name: "Solar",
      value: latestGeneration.all_solar_percent,
    },
    {
      name: "Wind",
      value: latestGeneration.wind_percent,
    },
    {
      name: "Nuclear",
      value: latestGeneration.nuclear_percent,
    },
    {
      name: "Hydropower",
      value: latestGeneration.hydro_electric_percent,
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
  chartData = chartData.filter(data => data.value > 0)
  // .sort((a, b) => a.value - b.value)

  // Count the number of clean power sectors for inner arc padding angle
  const ShownCleanPowerCount = chartData.filter(
    datum =>
      datum.name !== "Coal" &&
      datum.name !== "Natural Gas" &&
      datum.name !== "Petroleum"
  ).length
  const ShownDirtyPowerCount = chartData.length - ShownCleanPowerCount

  const totalCleanPercent =
    latestGeneration.all_solar_percent +
    latestGeneration.hydro_electric_percent +
    latestGeneration.nuclear_percent +
    latestGeneration.wind_percent

  const totalDirtyPercent = 100 - totalCleanPercent

  // This is very messy, but to line up the inner arc (which combines power
  // sectors) with the outer arc, we basically have to convert the padding angle
  // of the outer arc into a % and then add it to the clean and dirty arcs
  const OuterPaddingAnglePrcnt = 100 * (OuterPaddingAngle / 360)

  const cleanSectorsPaddingPrcnt =
    Math.max(ShownCleanPowerCount - 1, 0) * OuterPaddingAnglePrcnt
  const dirtySectorsPaddingPrcnt =
    Math.max(ShownDirtyPowerCount - 1, 0) * OuterPaddingAnglePrcnt

  const chartDataInner = [
    {
      value: totalCleanPercent + cleanSectorsPaddingPrcnt,
      name: "Carbon Free",
    },
    {
      value: totalDirtyPercent + dirtySectorsPaddingPrcnt,
      name: "Dirty",
    },
  ]

  /**
   * Render the label for each power slice. Some good test cases are:
   *
   * - Missouri (1% Solar, then 5% Wind)
   * - West Virginia (3% Wind then 3% Hydro)
   * - California (a bucnh of renewables, labels stack bottom right)
   */
  function renderCustomizedLabel({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) {
    const RADIAN = Math.PI / 180

    // How far out the default label should be compared to the chart radius -
    // this should be lower than our ideal so we can push out if needed
    const LabelRadiusMult = 1.5
    // A multiplier to make labels further out vertically and horizontally
    const YRadiusMult = 1.05
    const XRadiusMult = 1

    const radius = innerRadius + (outerRadius - innerRadius) * LabelRadiusMult
    const x = Math.round(
      cx + radius * XRadiusMult * Math.cos(-midAngle * RADIAN)
    )
    const y = Math.round(
      cy + radius * YRadiusMult * Math.sin(-midAngle * RADIAN)
    )
    const slicePercent = chartData[index].value
    const nextSlicePercent =
      chartData.length > index + 1 ? chartData[index + 1].value : 100

    // Align text to end if left of the chart, center if in the middle, and
    // align start if to the right of the chart
    const textAnchor =
      Math.abs(x - cx) < 20 ? "middle" : x > cx ? "start" : "end"

    let xOffset = 0
    let yOffset = 0

    // Shift top centered labels up if the next slice is also small
    // (e.g. Missouri with 1% Solar then 5% Wind)
    if (textAnchor === "middle" && y < outerRadius && nextSlicePercent < 10) {
      yOffset = -16
    }

    if (slicePercent > 0) {
      return (
        <text
          x={x + xOffset}
          y={y + yOffset}
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
          <PieChart margin={GraphMargin}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              startAngle={GraphStartAngle}
              endAngle={GraphEndAngle}
              innerRadius={"58%"}
              outerRadius={"75%"}
              paddingAngle={OuterPaddingAngle}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>

            {/* Inner pie chart shows what power sources are green or dirty */}
            <Pie
              data={chartDataInner}
              cx="50%"
              cy="50%"
              labelLine={false}
              startAngle={GraphStartAngle}
              endAngle={GraphEndAngle}
              innerRadius={"52%"}
              outerRadius={"56%"}
              paddingAngle={OuterPaddingAngle}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Pie>

            <text
              x={"50%"}
              y={"49%"}
              width={100}
              dominantBaseline="central"
              textAnchor="middle"
              className="inner-label -prcnt"
            >
              {totalCleanPercent}%
            </text>

            <text
              x={"50%"}
              y={"59%"}
              width={100}
              textAnchor="middle"
              className="inner-label"
            >
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
