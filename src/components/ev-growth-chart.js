import React, { useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

import { formatCompactNumber, formatNumber } from "../helper-functions"
import ChartLegend from "./chart-legend"

// Darker than the site's electrified green so the axis labels are readable
const evColor = "#2e7d32"
// A separate blue so the share axis isn't confused with the EV count axis
const shareColor = "#1565c0"
const allVehiclesColor = "#7a7a7a"

// Axis widths and right margin, shared with the legend so it lines up with the
// plot area between the two axes
const yAxisWidth = 60
const chartRightMargin = 10

/**
 * Tooltip rows, always all three even when the all vehicles line is hidden.
 * Counts get commas, the share gets one decimal and a %
 */
const tooltipRows = [
  {
    key: "EV_Registration",
    name: "EVs",
    color: evColor,
    format: formatNumber,
  },
  {
    key: "evSharePct",
    name: "EV Fleet Share",
    color: shareColor,
    format: value => `${value.toFixed(1)}%`,
  },
  {
    key: "Cars_All",
    name: "All Vehicles*",
    color: allVehiclesColor,
    format: formatNumber,
  },
]

/** A compact tooltip with the year and right-aligned values */
const EvGrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  // Read the whole data row, since hidden lines aren't in the payload
  const row = payload[0].payload

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-year">{label}</div>
      <table>
        <tbody>
          {tooltipRows.map(({ key, name, color, format }) => (
            <tr key={key} style={{ color }}>
              <td>{name}</td>
              <td className="chart-tooltip-value">{format(row[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * A line chart of EVs over time, with a dashed line for EVs as a share of all
 * vehicles on a fixed 0-100% axis, so it shows how far the state is from fully
 * electric. All vehicles share the EV axis, but EVs are so small next to them
 * that the line is hidden until its checkbox is checked.
 *
 * @param byYear An array, oldest first, of
 *
 * {
 *   year: number;
 *   Cars_All: number;
 *   EV_Registration: number;
 * }
 */
const EvGrowthChart = ({ byYear }) => {
  const [showAllVehicles, setShowAllVehicles] = useState(false)

  const data = byYear.map(row => ({
    ...row,
    evSharePct: (row.EV_Registration / row.Cars_All) * 100,
  }))

  return (
    <>
      <div className="chart-controls">
        <label>
          <input
            type="checkbox"
            checked={showAllVehicles}
            onChange={event => setShowAllVehicles(event.target.checked)}
          />
          Show all vehicles*
        </label>
      </div>
      <div className="ev-growth-chart">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: chartRightMargin, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis
              yAxisId="count"
              width={yAxisWidth}
              // Only the EV count axis is bold, the share axis stays regular
              tick={{ fontWeight: "bold" }}
              tickFormatter={formatCompactNumber}
              stroke={evColor}
            />
            <YAxis
              yAxisId="share"
              orientation="right"
              width={yAxisWidth}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={value => `${value}%`}
              stroke={shareColor}
            />
            <Tooltip content={<EvGrowthTooltip />} />
            <Line
              yAxisId="count"
              dataKey="EV_Registration"
              name="EVs"
              stroke={evColor}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="share"
              dataKey="evSharePct"
              name="EV Fleet Share (right axis)"
              stroke={shareColor}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
            />
            {/* Only drawn when checked, so the axis fits EVs until then */}
            {showAllVehicles && (
              <Line
                yAxisId="count"
                dataKey="Cars_All"
                name="All Vehicles*"
                stroke={allVehiclesColor}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* All vehicles is only listed when its line is drawn */}
      <ChartLegend
        marginLeft={yAxisWidth}
        marginRight={yAxisWidth + chartRightMargin}
        items={[
          { key: "evs", name: "EVs", color: evColor, type: "line" },
          {
            key: "share",
            name: "EV Fleet Share (right axis)",
            color: shareColor,
            type: "dashed",
          },
          ...(showAllVehicles
            ? [
                {
                  key: "all",
                  name: "All Vehicles*",
                  color: allVehiclesColor,
                  type: "line",
                },
              ]
            : []),
        ]}
      />
    </>
  )
}

export default EvGrowthChart
