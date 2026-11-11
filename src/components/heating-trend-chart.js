import React, { useState } from "react"
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

import { formatCompactNumber, formatNumber } from "../helper-functions"

// A darker step of the site's carbon-free green, so a thin line reads on white
const electricColor = "#1f8a1f"
// Homes burning fuel recede in gray, like faded fossil fuels in the power mix
// chart. A red or orange would be hard to tell from the green with red-green
// color blindness
const fuelColor = "#6b6b6b"

// The Census skipped standard 1-year estimates in 2020
const missingYear = 2020

/**
 * Each view's series. `value` and `moe` are keys in the data, `moe` being the
 * survey's margin of error for the value
 */
const modes = {
  share: {
    label: "Share (%)",
    series: [
      {
        key: "electric",
        name: "Electric",
        value: "fossilFreeHeatingPct",
        moe: "fossilFreeHeatingPctMoe",
        color: electricColor,
      },
    ],
  },
  total: {
    label: "Total homes",
    series: [
      {
        key: "electric",
        name: "Electric",
        value: "fossilFreeHomes",
        moe: "fossilFreeHomesMoe",
        color: electricColor,
      },
      {
        key: "fuel",
        name: "Burning fuel",
        value: "fossilHomes",
        moe: "fossilHomesMoe",
        color: fuelColor,
      },
    ],
  },
}

const HeatingTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  const row = payload[0].payload

  if (row.homes === null) {
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-year">{label}</div>
        <div className="chart-tooltip-note">
          No data, the Census skipped this year
        </div>
      </div>
    )
  }

  // Each row is a swatch and name, the value, and its margin of error
  const rows =
    mode === "share"
      ? [
          {
            key: "electric",
            name: "Electric",
            color: electricColor,
            value: `${row.fossilFreeHeatingPct.toFixed(1)}%`,
            moe: row.fossilFreeHeatingPctMoe,
          },
        ]
      : modes.total.series.map(({ key, name, value, moe, color }) => ({
          key,
          name,
          color,
          value: formatNumber(row[value]),
          moe: formatNumber(row[moe]),
        }))

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-year">{label}</div>
      <table>
        <tbody>
          {rows.map(({ key, name, color, value, moe }) => (
            <tr key={key}>
              <td>
                <span
                  className="chart-tooltip-swatch"
                  style={{ background: color }}
                />
                {name}
              </td>
              <td className="chart-tooltip-value">{value}</td>
              <td className="chart-tooltip-note">± {moe}</td>
            </tr>
          ))}
          <tr>
            <td className="chart-tooltip-indent">All homes</td>
            <td className="chart-tooltip-value">{formatNumber(row.homes)}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/**
 * Homes whose main heating doesn't burn fuel each year, as a share of homes or
 * as a count next to the homes that do burn fuel. Shaded bands are the
 * survey's margin of error
 */
const HeatingTrendChart = ({ byYear }) => {
  const [mode, setMode] = useState("share")

  // byYear is oldest first, from buildings.json
  const rows = byYear
  if (!rows || !rows.length) {
    return null
  }

  const { series } = modes[mode]

  // For each series, a [low, high] band and a dashed bridge over the missing
  // year, which only has values at the years either side of it
  const withSeries = rows.map(row => {
    const values = { ...row }
    series.forEach(({ key, value, moe }) => {
      values[`${key}Range`] = [row[value] - row[moe], row[value] + row[moe]]
      values[`${key}Bridge`] =
        row.year === missingYear - 1 || row.year === missingYear + 1
          ? row[value]
          : null
    })
    return values
  })

  // An empty missing year breaks the solid lines and bands there
  const emptyYear = { year: missingYear, homes: null }
  series.forEach(({ key, value }) => {
    emptyYear[value] = null
    emptyYear[`${key}Range`] = null
    emptyYear[`${key}Bridge`] = null
  })
  const data = [...withSeries, emptyYear].sort((a, b) => a.year - b.year)

  // A tick every 5 years, from the data so new years get labels
  const firstYear = rows[0].year
  const lastYear = rows[rows.length - 1].year
  const yearTicks = []
  for (let year = Math.ceil(firstYear / 5) * 5; year <= lastYear; year += 5) {
    yearTicks.push(year)
  }

  // Zoom the share axis to the data (with some room) rather than 0-100, where
  // small states' changes would look flat. Counts start at zero
  let yAxis
  if (mode === "share") {
    const low = Math.min(...withSeries.map(row => row.electricRange[0]))
    const high = Math.max(...withSeries.map(row => row.electricRange[1]))
    yAxis = {
      domain: [
        Math.max(0, Math.floor(low - 3)),
        Math.min(100, Math.ceil(high + 3)),
      ],
      tickFormatter: value => `${value}%`,
      allowDecimals: false,
    }
  } else {
    yAxis = { domain: [0, "auto"], tickFormatter: formatCompactNumber }
  }

  return (
    <>
      <div className="chart-controls">
        <div
          className="chart-toggle"
          role="group"
          aria-label="Show homes with electric heating as"
        >
          {Object.entries(modes).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              className={mode === key ? "-active" : ""}
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="heating-trend-chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0 }}>
            <CartesianGrid stroke="#e5e5e5" vertical={false} />
            <XAxis
              dataKey="year"
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={yearTicks}
              tickLine={false}
            />
            <YAxis {...yAxis} tickLine={false} axisLine={false} width={45} />
            <Tooltip
              content={<HeatingTooltip mode={mode} />}
              cursor={{ stroke: "#999", strokeWidth: 1 }}
            />
            {/* A legend only when there's more than one line to tell apart */}
            {series.length > 1 && (
              <Legend
                payload={series.map(({ key, name, color }) => ({
                  id: key,
                  value: name,
                  type: "line",
                  color,
                }))}
              />
            )}
            {series.map(({ key, color }) => (
              <Area
                key={`${key}-range`}
                dataKey={`${key}Range`}
                stroke="none"
                fill={color}
                fillOpacity={0.15}
                isAnimationActive={false}
                activeDot={false}
              />
            ))}
            {series.map(({ key, color }) => (
              <Line
                key={`${key}-bridge`}
                dataKey={`${key}Bridge`}
                stroke={color}
                strokeWidth={2}
                strokeDasharray="5 4"
                connectNulls
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            ))}
            {series.map(({ key, name, value, color }) => (
              <Line
                key={key}
                dataKey={value}
                name={name}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3, fill: color, stroke: "#fff", strokeWidth: 2 }}
                activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default HeatingTrendChart
