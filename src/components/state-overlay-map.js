import React, { useState } from "react"
import { navigate } from "gatsby"

import USMap from "../images/svg/usaStatesNoTerritories.js"
import {
  TrendGlyph,
  TrendIcon,
  TrendLevels,
  TrendSparkline,
  formatSlope,
} from "./trends"

import "../styles/state-overlay-map.css"

// The map's own viewBox is 928 wide, we add room on the right for the
// callouts of small northeastern states
const viewBoxWidth = 945
const viewBoxHeight = 587

/**
 * Where to center each state's marker, in map coordinates. Most are the state's
 * area centroid, nudged where that lands somewhere awkward (e.g. Michigan's
 * lower peninsula, Florida's peninsula)
 */
export const anchors = {
  alabama: [649, 405],
  alaska: [117, 503],
  arizona: [198, 360],
  arkansas: [544, 371],
  california: [72, 280],
  colorado: [319, 273],
  connecticut: [858, 178],
  delaware: [827, 245],
  district_of_columbia: [801, 252],
  florida: [760, 490],
  georgia: [712, 405],
  hawaii: [314, 553],
  idaho: [185, 165],
  illinois: [594, 262],
  indiana: [644, 253],
  iowa: [521, 212],
  kansas: [440, 292],
  kentucky: [675, 300],
  louisiana: [540, 445],
  maine: [891, 83],
  maryland: [805, 248],
  massachusetts: [870, 160],
  michigan: [658, 190],
  minnesota: [507, 125],
  mississippi: [597, 410],
  missouri: [541, 294],
  montana: [275, 89],
  nebraska: [418, 224],
  nevada: [134, 236],
  new_hampshire: [866, 128],
  new_jersey: [835, 215],
  new_mexico: [298, 373],
  new_york: [807, 158],
  north_carolina: [785, 330],
  north_dakota: [413, 93],
  ohio: [700, 237],
  oklahoma: [460, 357],
  oregon: [96, 122],
  pennsylvania: [780, 211],
  rhode_island: [877, 171],
  south_carolina: [752, 375],
  south_dakota: [414, 159],
  tennessee: [640, 342],
  texas: [418, 448],
  utah: [216, 253],
  vermont: [847, 124],
  virginia: [785, 285],
  washington: [116, 49],
  west_virginia: [740, 267],
  wisconsin: [575, 154],
  wyoming: [296, 182],
}

/**
 * States too small to fit a marker get a smaller one off to the side, joined to
 * the state by a leader line. Vermont sits above New York, the rest stack
 * down the Atlantic
 */
export const callouts = {
  vermont: [826, 72],
  new_hampshire: [912, 200],
  massachusetts: [912, 232],
  rhode_island: [912, 264],
  connecticut: [912, 296],
  new_jersey: [912, 328],
  delaware: [912, 360],
  maryland: [912, 392],
  district_of_columbia: [912, 424],
}

/**
 * Highlighting legend items: hovering or focusing one previews it, clicking
 * (or Enter or Space) keeps it highlighted until it's clicked again
 *
 * @returns highlight      The key to highlight, or null
 * @returns legendItemProps A function of a legend item's key to the props for
 *                         its <li>
 * @returns clearHighlight Clears the highlight, e.g. when the legend changes
 */
export function useLegendHighlight() {
  const [pinned, setPinned] = useState(null)
  const [preview, setPreview] = useState(null)
  // Keys can be 0, like the "near trend" level, so check for null
  const highlight = preview !== null ? preview : pinned

  function togglePin(key) {
    if (pinned === key) {
      setPinned(null)
      // Show the unpinned state right away rather than on mouse out
      setPreview(null)
    } else {
      setPinned(key)
    }
  }

  const legendItemProps = key => ({
    tabIndex: 0,
    role: "button",
    "aria-pressed": pinned === key,
    className:
      (pinned === key ? "-pinned" : "") + (highlight === key ? " -active" : ""),
    onMouseEnter: () => setPreview(key),
    onMouseLeave: () => setPreview(null),
    onFocus: () => setPreview(key),
    onBlur: () => setPreview(null),
    onClick: () => togglePin(key),
    onKeyDown: event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        togglePin(key)
      }
    },
  })

  function clearHighlight() {
    setPinned(null)
    setPreview(null)
  }

  return { highlight, legendItemProps, clearHighlight }
}

/** A legend color swatch */
export const Swatch = ({ color, className = "" }) => (
  <span
    className={"overlay-map-swatch " + className}
    style={color ? { background: color } : undefined}
  />
)

/** Roughly the tooltip's size with a sparkline, for flipping it on screen */
const TooltipWidth = 280
const TooltipHeight = 300

/**
 * A tooltip that follows the cursor, flipping left near the screen's right
 * edge and above the cursor near its bottom
 */
function Tooltip({ position, children }) {
  const style = {}
  if (typeof window !== "undefined") {
    if (position.x > window.innerWidth - TooltipWidth) {
      style.right = window.innerWidth - position.x + 16
    } else {
      style.left = position.x + 16
    }
    if (position.y > window.innerHeight - TooltipHeight) {
      style.bottom = window.innerHeight - position.y + 16
    } else {
      style.top = position.y + 16
    }
  }

  return (
    <div className="overlay-map-tooltip" style={style} role="tooltip">
      {children}
    </div>
  )
}

/**
 * A map of the US with a marker (like a small chart) over each state, and the
 * small northeastern states' markers off to the side. Hovering a state or its
 * marker shows a tooltip, and clicking goes to the state's page
 *
 * @param ariaLabel    The map's label for screen readers
 * @param getStateLabel Function of a location ({id, name}) to its screen reader
 *                     label
 * @param renderMarker Function of {location, cx, cy, isCallout, isHovered} to
 *                     the state's SVG marker, or null for none
 * @param renderTooltip Function of a location to the tooltip's contents
 * @param getStateFill Optional function of a location to its fill color, for
 *                     shading states by a value
 * @param trends       Optional trends from getTrends (see trends.js), plus
 *                     `unit` ("pts" or "%"). Tooltips always show a
 *                     sparkline of the state's history, and unless
 *                     `showGlyphs` is false, a trend glyph goes by each marker
 *                     with a legend that filters states by trend
 * @param trendOffset  How far right of a marker's center its trend glyph goes,
 *                     as { main, callout }. Callouts' glyphs go on their left,
 *                     since their labels are on the right
 */
const StateOverlayMap = ({
  ariaLabel,
  getStateLabel,
  renderMarker,
  renderTooltip,
  getStateFill,
  trends,
  trendOffset = { main: 20, callout: 16 },
}) => {
  const [hovered, setHovered] = useState(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  // The trend level clicked (or hovered) in the trend legend, fading states
  // with other trends
  const trendHighlight = useLegendHighlight()
  const showGlyphs = Boolean(trends && trends.showGlyphs !== false)
  const trendFilter = showGlyphs ? trendHighlight.highlight : null

  const getTrend = location => (trends ? trends.byState[location.id] : null)
  const isDimmed = location => {
    if (trendFilter === null) {
      return false
    }
    const trend = getTrend(location)
    return !trend || trend.level !== trendFilter
  }

  const locations = USMap.locations

  function hover(location, event) {
    setHovered(location)
    if (event && event.clientX !== undefined) {
      setPosition({ x: event.clientX, y: event.clientY })
    } else if (event) {
      // Keyboard focus has no mouse position, so use the state's middle
      const rect = event.target.getBoundingClientRect()
      setPosition({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 })
    }
  }

  function open(location, event) {
    const url = `/${location.id}`
    if (event && (event.ctrlKey || event.metaKey)) {
      window.open(url)
    } else {
      navigate(url)
    }
  }

  // Shared handlers so hovering a marker counts as hovering its state
  const handlersFor = location => ({
    onMouseEnter: event => hover(location, event),
    onMouseMove: event => setPosition({ x: event.clientX, y: event.clientY }),
    onMouseLeave: () => setHovered(null),
    onClick: event => open(location, event),
  })

  return (
    <>
      {showGlyphs && (
        <ul className="overlay-map-legend trend-legend">
          <li className="trend-legend-title">
            Trend, {trends.startYear}–{trends.endYear}:
          </li>
          {TrendLevels.map(({ level, name }) => (
            <li key={level} {...trendHighlight.legendItemProps(level)}>
              <TrendIcon level={level} />
              {name}
            </li>
          ))}
        </ul>
      )}

      <svg
        className="overlay-map"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        aria-label={ariaLabel}
      >
        {locations.map(location => (
          <path
            key={location.id}
            d={location.path}
            className={
              "overlay-map-state" +
              (hovered && hovered.id === location.id ? " -active" : "") +
              (isDimmed(location) ? " -dimmed" : "")
            }
            role="link"
            tabIndex={0}
            aria-label={getStateLabel(location)}
            // Inline, so it overrides the default and hover fills
            style={getStateFill ? { fill: getStateFill(location) } : undefined}
            onFocus={event => hover(location, event)}
            onBlur={() => setHovered(null)}
            onKeyDown={event => {
              if (event.key === "Enter") {
                open(location, event)
              }
            }}
            {...handlersFor(location)}
          />
        ))}

        {/* Leader lines go under every marker */}
        {Object.entries(callouts).map(([id, [x, y]]) => {
          const [ax, ay] = anchors[id]
          return (
            <g key={id} className="overlay-map-leader">
              <line x1={ax} y1={ay} x2={x} y2={y} />
              <circle cx={ax} cy={ay} r={1.5} />
            </g>
          )
        })}

        {locations.map(location => {
          const isCallout = Boolean(callouts[location.id])
          const [cx, cy] = callouts[location.id] || anchors[location.id]
          const marker = renderMarker({
            location,
            cx,
            cy,
            isCallout,
            isHovered: Boolean(hovered && hovered.id === location.id),
          })
          if (!marker) {
            return null
          }
          const trend = getTrend(location)
          return (
            <g
              key={location.id}
              className={
                "overlay-map-marker" + (isDimmed(location) ? " -dimmed" : "")
              }
              aria-hidden="true"
              {...handlersFor(location)}
            >
              {marker}
              {showGlyphs && trend && (
                <TrendGlyph
                  x={
                    isCallout ? cx - trendOffset.callout : cx + trendOffset.main
                  }
                  y={cy}
                  level={trend.level}
                />
              )}
            </g>
          )
        })}
      </svg>

      {hovered && (
        <Tooltip position={position}>
          <strong>{hovered.name}</strong>
          {renderTooltip(hovered)}
          {getTrend(hovered) && (
            <div className="overlay-map-tooltip-trend">
              <TrendSparkline trend={getTrend(hovered)} trends={trends} />
              {showGlyphs && (
                <div>
                  <TrendIcon level={getTrend(hovered).level} />
                  {`${formatSlope(getTrend(hovered).slope, trends.unit)} ` +
                    `over ${trends.startYear}–${trends.endYear}`}
                  {trends.nationalSlope != null &&
                    ` (US ${formatSlope(trends.nationalSlope, trends.unit)})`}
                </div>
              )}
            </div>
          )}
        </Tooltip>
      )}
    </>
  )
}

export default StateOverlayMap
