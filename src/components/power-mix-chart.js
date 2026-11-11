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
} from "recharts"

import ChartLegend from "./chart-legend"

/**
 * Power sources from the bottom of the stack up. Carbon-free sources are at
 * the bottom, so the top of their band is the carbon-free share. Colors match
 * the power sources pie chart (see state-details.css)
 */
const fuels = [
  { key: "nuclear", name: "Nuclear", color: "#df554a", clean: true },
  { key: "hydro_electric", name: "Hydropower", color: "#1983d7", clean: true },
  { key: "wind", name: "Wind", color: "#1fc3d9", clean: true },
  { key: "all_solar", name: "Solar", color: "#ffc702", clean: true },
  { key: "natural_gas", name: "Natural Gas", color: "#90684b", clean: false },
  { key: "coal", name: "Coal", color: "#333333", clean: false },
  { key: "petro_liquids", name: "Petroleum", color: "#bd732a", clean: false },
]

// The same green as the carbon-free ring in the power sources pie chart
const carbonFreeColor = "#28ac28"

// The y-axis width and right margin, shared with the legend so it lines up
// with the plot area rather than starting under the axis labels
const yAxisWidth = 60
const chartRightMargin = 10

/** Each view's data key suffix, axis and value formatting */
const modes = {
  share: {
    label: "Share (%)",
    suffix: "Pct",
    format: value => `${value.toFixed(1)}%`,
    axis: {
      domain: [0, 100],
      ticks: [0, 25, 50, 75, 100],
      tickFormatter: value => `${value}%`,
    },
  },
  total: {
    label: "Total (TWh)",
    suffix: "Twh",
    format: value => `${value.toFixed(1)} TWh`,
    axis: { tickFormatter: value => `${value}` },
  },
}

/**
 * A compact tooltip listing each source, biggest first, under the carbon-free
 * total, with carbon-free sources marked by a green bar. Sources that would
 * show as zero (often petroleum) are left out
 */
const PowerMixTooltip = ({ active, payload, label, mode }) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  const row = payload[0].payload
  const { suffix, format } = modes[mode]

  // Both modes show one decimal, so anything under 0.05 would read as 0.0
  const shownFuels = fuels
    .map(fuel => ({ ...fuel, value: row[`${fuel.key}${suffix}`] }))
    .filter(fuel => fuel.value >= 0.05)
    .sort((a, b) => b.value - a.value)

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-year">{label}</div>
      <table>
        <tbody>
          <tr className="chart-tooltip-total">
            {/* Same indent as the source rows below, without a bar */}
            <td className="chart-tooltip-source">
              <span
                className="chart-tooltip-swatch"
                style={{ background: carbonFreeColor }}
              />
              Carbon-Free
            </td>
            <td className="chart-tooltip-value">
              {format(row[`carbonFree${suffix}`])}
            </td>
          </tr>
          {/* A gap, since the total is its own value rather than a source */}
          <tr className="chart-tooltip-spacer" aria-hidden="true">
            <td colSpan={2} />
          </tr>
          {/* A swatch rather than colored text, since solar's yellow and
              wind's light blue are hard to read as text. A green bar on the
              left marks the sources that add up to the carbon-free total */}
          {shownFuels.map(fuel => (
            <tr key={fuel.key}>
              <td
                className="chart-tooltip-source"
                style={{
                  borderLeftColor: fuel.clean ? carbonFreeColor : "transparent",
                }}
              >
                <span
                  className="chart-tooltip-swatch"
                  style={{ background: fuel.color }}
                />
                {fuel.name}
              </td>
              <td className="chart-tooltip-value">{format(fuel.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * A filled area chart of each power source's generation over time, as a share
 * of all generation or as a total, with a green line along the top of the
 * carbon-free sources.
 *
 * Shares are calculated from generation (GWh) rather than the rounded
 * `_percent` fields, so each year adds up to exactly 100%.
 *
 * @param generationByYear An array, in any order, of
 *
 * {
 *   year: number;
 *   coal: number;
 *   natural_gas: number;
 *   petro_liquids: number;
 *   nuclear: number;
 *   hydro_electric: number;
 *   all_solar: number;
 *   wind: number;
 * }
 */
const PowerMixChart = ({ generationByYear }) => {
  const [mode, setMode] = useState("share")
  // Fading fossil fuels helps the carbon-free share stand out
  const [fadeFossil, setFadeFossil] = useState(true)
  const { suffix, axis } = modes[mode]

  // Every source as a share (e.g. coalPct) and a total in TWh (e.g. coalTwh),
  // plus the carbon-free sum of each
  const data = [...generationByYear]
    .sort((a, b) => a.year - b.year)
    .map(row => {
      // EIA reports net generation, which can dip below zero when a plant
      // uses more power than it makes in a year (e.g. Delaware's coal in
      // 2023). Count those as zero so they don't eat into the stack above
      const gwh = {}
      fuels.forEach(({ key }) => {
        gwh[key] = Math.max(0, row[key] || 0)
      })
      const totalGwh = fuels.reduce((acc, { key }) => acc + gwh[key], 0)
      const values = { year: row.year, carbonFreePct: 0, carbonFreeTwh: 0 }
      fuels.forEach(({ key, clean }) => {
        values[`${key}Pct`] = totalGwh > 0 ? (gwh[key] / totalGwh) * 100 : 0
        values[`${key}Twh`] = gwh[key] / 1000
        if (clean) {
          values.carbonFreePct += values[`${key}Pct`]
          values.carbonFreeTwh += values[`${key}Twh`]
        }
      })
      return values
    })

  return (
    <div>
      <div className="chart-controls">
        <div
          className="chart-toggle"
          role="group"
          aria-label="Show power generation as"
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

        <label>
          <input
            type="checkbox"
            checked={fadeFossil}
            onChange={event => setFadeFossil(event.target.checked)}
          />
          Fade fossil fuels
        </label>
      </div>

      <div className="power-mix-chart">
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{ top: 10, right: chartRightMargin, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="year" />
            <YAxis {...axis} width={yAxisWidth} />
            <Tooltip content={<PowerMixTooltip mode={mode} />} />
            {fuels.map(({ key, name, color, clean }) => {
              const faded = fadeFossil && !clean
              return (
                <Area
                  key={key}
                  type="linear"
                  dataKey={`${key}${suffix}`}
                  name={name}
                  stackId="mix"
                  stroke={color}
                  strokeOpacity={faded ? 0.3 : 1}
                  fill={color}
                  fillOpacity={faded ? 0.2 : 0.85}
                  isAnimationActive={false}
                />
              )
            })}
            {/* Not stacked, so it sits along the top of the carbon-free band */}
            <Line
              type="linear"
              dataKey={`carbonFree${suffix}`}
              name="Carbon-Free"
              stroke={carbonFreeColor}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Carbon-free sources first, then fossil fuels and the carbon-free
          line, fading fossil fuels along with the chart */}
      <ChartLegend
        marginLeft={yAxisWidth}
        marginRight={chartRightMargin}
        items={[
          ...fuels.map(({ key, name, color, clean }) => ({
            key,
            name,
            color,
            faded: fadeFossil && !clean,
          })),
          {
            key: "carbonFree",
            name: "Carbon-Free",
            color: carbonFreeColor,
            type: "line",
          },
        ]}
      />
    </div>
  )
}

export default PowerMixChart
