import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"

import { formatCompactNumber, formatNumber } from "../helper-functions"

/**
 * Darker steps of the wind and solar colors in the power sources charts, so
 * thin lines stay visible on the white page
 */
const sources = [
  { key: "wind", name: "Wind", color: "#0f8fa3" },
  { key: "solar", name: "Solar", color: "#c98a00" },
]

const formatMw = value => `${formatNumber(value)} MW`

const formatPct = (value, total) =>
  total > 0 ? `${((value / total) * 100).toFixed(0)}%` : "–"

const ProgressTooltip = ({
  active,
  payload,
  label,
  targets,
  annualTargets,
}) => {
  if (!active || !payload || !payload.length) {
    return null
  }

  const row = payload[0].payload

  // A group of rows per source, so the tooltip stays narrow
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-year">{label}</div>
      <table>
        <tbody>
          {sources.map(({ key, name, color }) => {
            const added = row[`${key}Added`]
            return (
              <React.Fragment key={key}>
                <tr className="chart-tooltip-group">
                  <td colSpan={3}>
                    <span
                      className="chart-tooltip-swatch"
                      style={{ background: color }}
                    />
                    {name}
                  </td>
                </tr>
                <tr>
                  <td className="chart-tooltip-indent">Total</td>
                  <td className="chart-tooltip-value">{formatMw(row[key])}</td>
                  <td className="chart-tooltip-note">
                    {formatPct(row[key], targets[key])} of target
                  </td>
                </tr>
                {added !== null && (
                  <tr>
                    <td className="chart-tooltip-indent">Built</td>
                    <td className="chart-tooltip-value">
                      {added >= 0 ? "+" : "−"}
                      {formatMw(Math.abs(added))}
                    </td>
                    <td className="chart-tooltip-note">
                      {formatPct(added, annualTargets[key])} of yearly goal
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/**
 * Wind and solar capacity built each year, against the capacity each needs to
 * reach its target (dashed lines), all in MW from target_generation.json, where
 * capacity is estimated from generation with national capacity factors.
 * The tooltip also shows what was added each year against `annualWindMw` and
 * `annualSolarMw`, the MW a year to build to reach the targets by 2050.
 */
const RenewablesProgressChart = ({
  capacityByYear,
  targetWindMw,
  targetSolarMw,
  annualWindMw,
  annualSolarMw,
}) => {
  // capacityByYear is oldest first. Built that year is the change from the
  // year before, so the first year has none
  const data = capacityByYear.map((row, i, rows) => ({
    year: row.year,
    wind: row.wind_mw,
    solar: row.solar_mw,
    windAdded: i === 0 ? null : row.wind_mw - rows[i - 1].wind_mw,
    solarAdded: i === 0 ? null : row.solar_mw - rows[i - 1].solar_mw,
  }))

  const targets = { wind: targetWindMw, solar: targetSolarMw }

  const annualTargets = { wind: annualWindMw, solar: annualSolarMw }

  const maxValue = Math.max(
    targets.wind,
    targets.solar,
    ...data.map(row => Math.max(row.wind, row.solar))
  )

  return (
    <>
      <div className="renewables-progress-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0 }}>
            <CartesianGrid stroke="#e5e5e5" vertical={false} />
            <XAxis dataKey="year" tickLine={false} />
            <YAxis
              domain={[0, Math.ceil(maxValue * 1.08)]}
              tickFormatter={formatCompactNumber}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip
              content={
                <ProgressTooltip
                  targets={targets}
                  annualTargets={annualTargets}
                />
              }
              cursor={{ stroke: "#999", strokeWidth: 1 }}
            />
            <Legend />
            {sources.map(({ key, name, color }) => (
              <ReferenceLine
                key={`${key}-target`}
                y={targets[key]}
                stroke={color}
                strokeDasharray="6 4"
                strokeWidth={2}
                label={{
                  value: `${name} target: ${formatMw(targets[key])}`,
                  position: "insideTopLeft",
                  fill: "#33342e",
                  fontSize: 12,
                }}
              />
            ))}
            {sources.map(({ key, name, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={`${name} built`}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export default RenewablesProgressChart
