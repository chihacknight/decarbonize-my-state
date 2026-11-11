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

// 1,234,567 -> 1.2M, 56,789 -> 57k
const formatHomesTick = value => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k`
  }
  return `${value}`
}

const HeatingTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  const row = payload[0].payload

  if (row.homes === null) {
    return (
      <div className="custom-tooltip">
        <strong>{label}</strong>
        <div className="small text-secondary">
          No data, the Census skipped this year
        </div>
      </div>
    )
  }

  if (mode === "share") {
    return (
      <div className="custom-tooltip">
        <strong>{label}</strong>
        <div className="small">
          {row.fossilFreeHeatingPct.toFixed(1)}% electric{" "}
          <span className="text-secondary">
            ± {row.fossilFreeHeatingPctMoe}
          </span>
        </div>
        <div className="small text-secondary">
          of {row.homes.toLocaleString()} homes
        </div>
      </div>
    )
  }

  return (
    <div className="custom-tooltip">
      <strong>{label}</strong>
      {modes.total.series.map(({ key, name, value, moe, color }) => (
        <div key={key} className="small">
          <span style={{ color }}>■</span> {name}: {row[value].toLocaleString()}{" "}
          <span className="text-secondary">± {row[moe].toLocaleString()}</span>
        </div>
      ))}
      <div className="small text-secondary">
        Total: {row.homes.toLocaleString()} homes
      </div>
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
    yAxis = { domain: [0, "auto"], tickFormatter: formatHomesTick }
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
              ticks={[2005, 2010, 2015, 2020, 2025]}
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
