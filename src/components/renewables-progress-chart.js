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

/**
 * Darker steps of the wind and solar colors in the power sources charts, so
 * thin lines stay visible on the white page
 */
const sources = [
  { key: "wind", name: "Wind", color: "#0f8fa3" },
  { key: "solar", name: "Solar", color: "#c98a00" },
]

const hoursPerYear = 24 * 365

/** Yearly GWh to the MW of capacity it takes, given a capacity factor */
const gwhToCapacityMw = (gwh, capacityFactor) =>
  ((gwh / hoursPerYear) * 1000) / capacityFactor

const formatMw = value => `${Math.round(value).toLocaleString()} MW`

// 101,000 -> 101k, keeps the axis narrow for big states
const formatTick = value =>
  value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`

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

  // Stacked, one block per source, so the tooltip stays narrow
  return (
    <div className="custom-tooltip">
      <strong>{label}</strong>
      {sources.map(({ key, name, color }) => {
        const added = row[`${key}Added`]
        return (
          <div key={key} className="mt-1">
            <div>
              <span style={{ color }}>■</span> <strong>{name}</strong>
            </div>
            <div className="small">
              Total: {formatMw(row[key])}{" "}
              <span className="text-secondary">
                ({formatPct(row[key], targets[key])} of target)
              </span>
            </div>
            {added !== null && (
              <div className="small">
                Built: {added >= 0 ? "+" : "−"}
                {formatMw(Math.abs(added))}{" "}
                <span className="text-secondary">
                  ({formatPct(added, annualTargets[key])} of yearly goal)
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Wind and solar capacity built each year, against the capacity each needs to
 * reach its target (dashed lines). Capacity is estimated from generation with
 * national capacity factors, the same way as the text on the state page.
 * The tooltip also shows what was added each year against `annualWindMw` and
 * `annualSolarMw`, the MW a year to build to reach the targets by 2050.
 */
const RenewablesProgressChart = ({
  generationByYear,
  targetWindGwh,
  targetSolarGwh,
  windCapacityFactor,
  solarCapacityFactor,
  annualWindMw,
  annualSolarMw,
}) => {
  // generationByYear may be sorted newest first, so copy before sorting
  const data = [...generationByYear]
    .sort((a, b) => a.year - b.year)
    .map(row => ({
      year: row.year,
      wind: gwhToCapacityMw(row.wind || 0, windCapacityFactor),
      solar: gwhToCapacityMw(row.all_solar || 0, solarCapacityFactor),
    }))
    // Built that year is the change from the year before, so the first year
    // has none
    .map((row, i, rows) => ({
      ...row,
      windAdded: i === 0 ? null : row.wind - rows[i - 1].wind,
      solarAdded: i === 0 ? null : row.solar - rows[i - 1].solar,
    }))

  const targets = {
    wind: gwhToCapacityMw(targetWindGwh, windCapacityFactor),
    solar: gwhToCapacityMw(targetSolarGwh, solarCapacityFactor),
  }

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
              tickFormatter={formatTick}
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
