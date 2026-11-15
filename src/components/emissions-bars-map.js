import React from "react"

import StateOverlayMap, {
  Swatch,
  useLegendHighlight,
} from "./state-overlay-map"
import { EmissionsCategories } from "../constants/emissions-categories"
import { getShortCitation } from "../constants/source-citations"

/**
 * The emissions categories from the state pages, stacked from the bottom of
 * each bar up. The state pages use shades of grey, which are too close
 * together to tell apart on small bars, so these get their own colors
 */
const categoryColors = {
  buildings: "#f2a541",
  transport: "#3f7cc4",
  power: "#4d4d4d",
  other: "#ad8669",
}

const categories = Object.entries(EmissionsCategories).map(
  ([id, category]) => ({
    id,
    key: category.key,
    name: category.longName,
    color: categoryColors[id],
  })
)

const barWidth = 12
const barHeight = 38
const calloutBarWidth = 10
const calloutBarHeight = 28

/**
 * A 100% stacked bar of a state's emissions by category. A highlighted
 * category moves to the bottom so its share lines up across states, the
 * others fade out and its share shows by the bar
 */
function MiniBar({ cx, cy, width, height, emissions, highlight, isCallout }) {
  const left = cx - width / 2
  const top = cy - height / 2

  // The highlighted category first, so it's at the bottom
  const ordered = highlight
    ? [
        ...categories.filter(({ key }) => key === highlight),
        ...categories.filter(({ key }) => key !== highlight),
      ]
    : categories

  let fromBottom = 0
  const segments = ordered.map(category => {
    const segmentHeight = (emissions.shares[category.key] / 100) * height
    const y = top + height - fromBottom - segmentHeight
    fromBottom += segmentHeight
    return { ...category, y, segmentHeight }
  })

  return (
    <g className="mini-bar">
      <rect
        x={left - 1.5}
        y={top - 1.5}
        width={width + 3}
        height={height + 3}
        rx={1.5}
        className="mini-bar-bg"
      />
      {segments.map(segment => (
        <rect
          key={segment.key}
          x={left}
          y={0}
          width={width}
          height={segment.segmentHeight}
          fill={segment.color}
          // Moved with a transform rather than y, so it can animate
          style={{ transform: `translate(0px, ${segment.y}px)` }}
          className={
            "overlay-map-part mini-bar-segment" +
            (highlight && highlight !== segment.key ? " -faded" : "")
          }
        />
      ))}
      {highlight && (
        // Above the bar, or to its right for callouts stacked down the side
        <text
          x={isCallout ? left + width + 3 : cx}
          y={isCallout ? cy : top - 4}
          textAnchor={isCallout ? "start" : "middle"}
          dominantBaseline={isCallout ? "central" : "auto"}
          className="mini-bar-label"
          style={{ fontSize: isCallout ? 8 : 9 }}
        >
          {emissions.shares[highlight]}%
        </text>
      )}
    </g>
  )
}

/** The tooltip's contents: total emissions and each category's share */
function TooltipContents({ emissions }) {
  if (!emissions) {
    return <div>Data not available</div>
  }

  return (
    <>
      <div className="overlay-map-tooltip-total">
        {Math.round(emissions.total)} MMTCO<sub>2</sub>e in {emissions.year}
      </div>
      <table>
        <tbody>
          {/* Top of the bar first, like it's drawn */}
          {[...categories].reverse().map(category => (
            <tr key={category.key}>
              <td>
                <Swatch color={category.color} />
                {category.name}
              </td>
              <td className="text-right pl-3">
                {emissions.shares[category.key]}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

/**
 * A map of the US with a small bar over each state showing its climate
 * pollution by category, like the bar chart on each state's page
 *
 * @param trendsBySeries Optional trends for the total ("total") and each
 * category's key, see trends.js. A highlighted category shows its own
 *
 * @param emissionsByState An object of state slug to its latest year's
 * emissions, e.g.
 *
 * {
 *   illinois: {
 *     year: number;
 *     total: number; // In MMTCO2e
 *     shares: {
 *       buildings: number; // Rounded percent of the total
 *       transportation: number;
 *       dirty_power: number;
 *       dumps_farms_industrial_other: number;
 *     }
 *   }
 * }
 */
const EmissionsBarsMap = ({ emissionsByState, trendsBySeries }) => {
  // The legend item whose share each bar starts with, from the bottom
  const { highlight, legendItemProps } = useLegendHighlight()

  return (
    <div className="overlay-map-section">
      <ul className="overlay-map-legend">
        {[...categories].reverse().map(category => (
          <li key={category.key} {...legendItemProps(category.key)}>
            <Swatch color={category.color} />
            {category.name}
          </li>
        ))}
        <li className="text-secondary">
          Click a source to compare it, or hover a state for details
        </li>
      </ul>

      <StateOverlayMap
        ariaLabel="Map of each state's climate pollution by source"
        trends={trendsBySeries && trendsBySeries[highlight || "total"]}
        trendOffset={{
          main: barWidth / 2 + 7,
          callout: calloutBarWidth / 2 + 7,
        }}
        getStateLabel={location => {
          const emissions = emissionsByState[location.id]
          if (!emissions) {
            return `${location.name}: data not available`
          }
          const shares = categories
            .map(({ key, name }) => `${name} ${emissions.shares[key]}%`)
            .join(", ")
          return `${location.name}: climate pollution from ${shares}`
        }}
        renderMarker={({ location, cx, cy, isCallout }) => {
          const emissions = emissionsByState[location.id]
          if (!emissions) {
            return null
          }
          return (
            <MiniBar
              cx={cx}
              cy={cy}
              width={isCallout ? calloutBarWidth : barWidth}
              height={isCallout ? calloutBarHeight : barHeight}
              emissions={emissions}
              highlight={highlight}
              isCallout={isCallout}
            />
          )
        }}
        renderTooltip={location => (
          <TooltipContents emissions={emissionsByState[location.id]} />
        )}
      />

      <span className="text-secondary keyText">
        Source: {getShortCitation("emissions")}
      </span>
    </div>
  )
}

export default EmissionsBarsMap
