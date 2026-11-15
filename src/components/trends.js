import React from "react"

/**
 * Trend indicators for the /map page: how each state's pace on a map's metric
 * compares with the US as a whole (the "trend").
 *
 * Each state's pace is the slope of a straight line fit over its recent years,
 * so one odd year (like a drought cutting hydropower) doesn't flip it. Levels:
 *
 *  2  Top 25% of states by pace, if improving
 *  1  Ahead of trend: at or above the US pace
 *  0  Near trend: half the US pace or more
 * -1  Behind trend: a quarter of the US pace or more
 * -2  Very behind trend: under a quarter of the US pace, or getting worse
 *
 * This compares states by pace rather than direction, since some metrics
 * barely ever go backwards, like the share of cars that are electric. When the
 * US isn't improving at all, like building emissions, states are compared
 * against getting no worse instead: improving is ahead of trend, worsening
 * slower than the US is near it, up to twice as fast is behind it, and faster
 * is very behind
 */

/** The share of states, from the fastest improving, that get two arrows */
const TopShare = 0.25

/** Fractions of the US pace that are near, and behind, the trend */
const NearTrendFraction = 0.5
const BehindTrendFraction = 0.25

export const TrendLevels = [
  { level: 2, name: "Top 25% by pace" },
  { level: 1, name: "Ahead of trend" },
  { level: 0, name: "Near trend" },
  { level: -1, name: "Behind trend" },
  { level: -2, name: "Very behind trend" },
]

/**
 * A state's level from how much it's improving per year (negative when
 * worsening) and the US's, before the top 25% get theirs
 */
function getLevel(improvement, usImprovement) {
  if (usImprovement > 0) {
    if (improvement >= usImprovement) {
      return 1
    }
    if (improvement >= usImprovement * NearTrendFraction) {
      return 0
    }
    if (improvement >= usImprovement * BehindTrendFraction) {
      return -1
    }
    return -2
  }

  // The US is flat or getting worse
  if (improvement > 0) {
    return 1
  }
  if (improvement >= usImprovement) {
    return 0
  }
  if (improvement >= usImprovement * 2) {
    return -1
  }
  return -2
}

const TrendColors = {
  up: "#1e9c35",
  flat: "#8a8a8a",
  down: "#d43d2f",
}

/**
 * The least-squares line through [{year, value}], with its slope in value per
 * year
 */
function getFit(points) {
  const count = points.length
  const meanYear = points.reduce((acc, { year }) => acc + year, 0) / count
  const meanValue = points.reduce((acc, { value }) => acc + value, 0) / count
  let numerator = 0
  let denominator = 0
  points.forEach(({ year, value }) => {
    numerator += (year - meanYear) * (value - meanValue)
    denominator += (year - meanYear) ** 2
  })
  const slope = denominator ? numerator / denominator : 0
  return { slope, intercept: meanValue - slope * meanYear }
}

/**
 * A series, sorted by year, as a percent of the first year in the window when
 * `relative`, e.g. for emissions, where states' totals vary so much that only
 * the percent change is comparable. Also returns the points within the last
 * `years` years, which the trend is fit over
 */
function getSeries(history, years, relative) {
  const sorted = [...history]
    .filter(({ value }) => value != null && !isNaN(value))
    .sort((a, b) => a.year - b.year)
  if (!sorted.length) {
    return { series: [], windowPoints: [] }
  }
  const lastYear = sorted[sorted.length - 1].year
  const inWindow = ({ year }) => year > lastYear - years
  let series = sorted
  if (relative) {
    const base = sorted.find(inWindow).value
    if (!base) {
      return { series: [], windowPoints: [] }
    }
    series = sorted.map(({ year, value }) => ({
      year,
      value: (value / base) * 100,
    }))
  }
  return { series, windowPoints: series.filter(inWindow) }
}

/**
 * Classify every state's trend
 *
 * @param historyByState  State slug to [{year, value}]
 * @param nationalHistory The US as a whole as [{year, value}]
 * @param years           How many recent years to fit the trend over
 * @param higherIsBetter  False when the value should go down, like emissions
 * @param relative        Fit the percent change, rather than the value itself
 * @param ceiling         Above this value, never call a state behind the
 *                        trend, since it's nearly done and small dips near the
 *                        top are mostly noise
 *
 * @returns {
 *   byState: { [slug]: { slope, intercept, level, series } },
 *   nationalSlope, nationalSeries, startYear, endYear, relative
 * }
 * with slopes in value per year, as is (so negative for falling emissions),
 * and each series as [{year, value}] for sparklines, relative when `relative`
 */
export function getTrends({
  historyByState,
  nationalHistory,
  years,
  higherIsBetter = true,
  relative = false,
  ceiling = null,
}) {
  const direction = higherIsBetter ? 1 : -1

  const national = getSeries(nationalHistory || [], years, relative)
  const nationalSlope =
    national.windowPoints.length > 1
      ? getFit(national.windowPoints).slope
      : null

  const usImprovement = nationalSlope != null ? direction * nationalSlope : 0

  // Each state's slope, and how much it's improving (positive) or worsening
  const slopes = {}
  let startYear = null
  let endYear = null
  Object.entries(historyByState).forEach(([slug, history]) => {
    const { series, windowPoints: points } = getSeries(history, years, relative)
    if (points.length < 3) {
      return
    }
    slopes[slug] = {
      ...getFit(points),
      series,
      latest: history.reduce((a, b) => (b.year > a.year ? b : a)).value,
    }
    const first = points[0].year
    const last = points[points.length - 1].year
    startYear = startYear === null ? first : Math.min(startYear, first)
    endYear = endYear === null ? last : Math.max(endYear, last)
  })

  const ranked = Object.keys(slopes).sort(
    (a, b) => direction * (slopes[b].slope - slopes[a].slope)
  )
  const topCount = Math.round(ranked.length * TopShare)

  const byState = {}
  ranked.forEach((slug, rank) => {
    const { slope, intercept, series, latest } = slopes[slug]
    const improvement = direction * slope
    let level = getLevel(improvement, usImprovement)
    if (rank < topCount && improvement > 0) {
      level = 2
    } else if (level < 0 && ceiling != null && latest >= ceiling) {
      level = 0
    }
    byState[slug] = { slope, intercept, level, series }
  })

  return {
    byState,
    nationalSlope,
    nationalSeries: national.series,
    startYear,
    endYear,
    relative,
  }
}

/**
 * A trend chevron (or two, or a dash) centered at x, y in SVG units, with a
 * white outline so it reads on any fill
 */
export function TrendGlyph({ x, y, level, size = 4 }) {
  const color =
    level > 0 ? TrendColors.up : level < 0 ? TrendColors.down : TrendColors.flat

  let d
  if (level === 0) {
    d = `M${x - size} ${y} H${x + size}`
  } else {
    // A chevron pointing up (or down), stacked when doubled
    const sign = level > 0 ? 1 : -1
    const chevron = cy =>
      `M${x - size} ${cy + (sign * size) / 2} L${x} ${cy -
        (sign * size) / 2} L${x + size} ${cy + (sign * size) / 2}`
    d =
      Math.abs(level) === 2
        ? `${chevron(y - size * 0.55)} ${chevron(y + size * 0.55)}`
        : chevron(y)
  }

  return (
    <g className="trend-glyph">
      <path d={d} className="trend-glyph-outline" />
      <path d={d} stroke={color} className="trend-glyph-line" />
    </g>
  )
}

/** A trend glyph as a small inline SVG, for legends and tooltips */
export function TrendIcon({ level }) {
  return (
    <svg
      className="trend-icon"
      viewBox="0 0 14 14"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <TrendGlyph x={7} y={7} level={level} size={4} />
    </svg>
  )
}

/**
 * A slope as text, like "+0.8 pts/yr", using the metric's unit
 *
 * @param unit "pts" for percentage points, "%" for percent change
 */
export function formatSlope(slope, unit) {
  if (slope == null) {
    return "?"
  }
  const sign = slope > 0 ? "+" : slope < 0 ? "−" : ""
  const digits = Math.abs(slope) < 0.1 ? 2 : 1
  const value = Math.abs(slope).toFixed(digits)
  return unit === "%" ? `${sign}${value}%/yr` : `${sign}${value} pts/yr`
}

/** Brighter trend colors for the sparkline's dark tooltip background */
const SparklineTrendColors = {
  up: "#5fd36f",
  flat: "#bdbdbd",
  down: "#ff7a6b",
}

const SparklineWidth = 220
const SparklineHeight = 70
const SparklinePadding = { top: 6, right: 30, bottom: 14, left: 4 }

/** A value as a short label, like "4.2%" or, for relative series, "-12%" */
function formatSparklineValue(value, relative) {
  if (relative) {
    const change = Math.round(value - 100)
    return `${change > 0 ? "+" : change < 0 ? "−" : ""}${Math.abs(change)}%`
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)}%`
}

/**
 * A small line chart of a state's history for the map tooltips: the state as
 * a solid line, the US as a dashed one, the trend's years shaded and its
 * fitted line drawn over them in the trend's color
 *
 * @param trend  The state's entry from getTrends' byState
 * @param trends Everything getTrends returned, for the US series and years
 */
export function TrendSparkline({ trend, trends }) {
  const { series, slope, intercept, level } = trend
  const { nationalSeries, startYear, endYear, relative } = trends
  if (!series || series.length < 2) {
    return null
  }

  const all = [...series, ...(nationalSeries || [])]
  const firstYear = Math.min(...all.map(({ year }) => year))
  const lastYear = Math.max(...all.map(({ year }) => year))
  let minValue = Math.min(...all.map(({ value }) => value))
  let maxValue = Math.max(...all.map(({ value }) => value))
  // Keep flat lines from filling the chart with noise
  const minSpan = relative ? 10 : 1
  if (maxValue - minValue < minSpan) {
    const middle = (maxValue + minValue) / 2
    minValue = middle - minSpan / 2
    maxValue = middle + minSpan / 2
  }

  const { top, right, bottom, left } = SparklinePadding
  const plotWidth = SparklineWidth - left - right
  const plotHeight = SparklineHeight - top - bottom
  const x = year =>
    left + ((year - firstYear) / Math.max(lastYear - firstYear, 1)) * plotWidth
  const y = value =>
    top + (1 - (value - minValue) / (maxValue - minValue)) * plotHeight
  const toPath = points =>
    points
      .map(({ year, value }, i) => `${i ? "L" : "M"}${x(year)} ${y(value)}`)
      .join(" ")

  const trendColor =
    level > 0
      ? SparklineTrendColors.up
      : level < 0
      ? SparklineTrendColors.down
      : SparklineTrendColors.flat
  const last = series[series.length - 1]

  return (
    <div className="trend-sparkline">
      <svg
        viewBox={`0 0 ${SparklineWidth} ${SparklineHeight}`}
        width={SparklineWidth}
        height={SparklineHeight}
        aria-hidden="true"
      >
        {/* The years the trend is fit over */}
        <rect
          x={x(startYear)}
          y={top}
          width={x(endYear) - x(startYear)}
          height={plotHeight}
          className="trend-sparkline-window"
        />
        {nationalSeries && nationalSeries.length > 1 && (
          <path d={toPath(nationalSeries)} className="trend-sparkline-us" />
        )}
        <path d={toPath(series)} className="trend-sparkline-state" />
        <line
          x1={x(startYear)}
          y1={y(intercept + slope * startYear)}
          x2={x(endYear)}
          y2={y(intercept + slope * endYear)}
          stroke={trendColor}
          className="trend-sparkline-fit"
        />
        <circle cx={x(last.year)} cy={y(last.value)} r={2.5} fill="#fff" />
        <text
          x={x(last.year) + 5}
          y={y(last.value)}
          dominantBaseline="central"
          className="trend-sparkline-label"
        >
          {formatSparklineValue(last.value, relative)}
        </text>
        <text x={left} y={SparklineHeight - 2} className="trend-sparkline-year">
          {firstYear}
        </text>
        <text
          x={left + plotWidth}
          y={SparklineHeight - 2}
          textAnchor="end"
          className="trend-sparkline-year"
        >
          {lastYear}
        </text>
      </svg>
      <div className="trend-sparkline-key">
        <span className="-state">State</span>
        <span className="-us">US</span>
        {relative && <span>Change since {startYear}</span>}
      </div>
    </div>
  )
}
