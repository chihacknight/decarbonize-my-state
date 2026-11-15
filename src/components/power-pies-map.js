import React, { useState } from "react"

import StateOverlayMap, {
  Swatch,
  useLegendHighlight,
} from "./state-overlay-map"
import { getShadeColor, ScaleLegend } from "./share-shade-map"
import { getShortCitation } from "../constants/source-citations"

/**
 * Power sources in the same order and colors as the power sources pie chart
 * on each state's page (see power-sources-chart.js and state-details.css)
 */
const sources = [
  { key: "all_solar", name: "Solar", color: "#ffc702", clean: true },
  { key: "wind", name: "Wind", color: "#1fc3d9", clean: true },
  { key: "nuclear", name: "Nuclear", color: "#df554a", clean: true },
  { key: "hydro_electric", name: "Hydropower", color: "#1983d7", clean: true },
  { key: "coal", name: "Coal", color: "#333333", clean: false },
  { key: "natural_gas", name: "Natural Gas", color: "#90684b", clean: false },
  { key: "petro_liquids", name: "Petroleum", color: "#bd732a", clean: false },
]

const carbonFreeColor = "#28ac28"

// The rest of the ring when only the carbon-free share is shown
const fossilColor = "#c4c4c4"

const pieRadius = 18
const calloutRadius = 14

/** An SVG path for a ring slice between two angles, in degrees clockwise from 12 o'clock */
function arcPath(cx, cy, innerR, outerR, startDeg, endDeg) {
  // A full circle can't be drawn as one arc, so stop just short of it
  const sweep = Math.min(endDeg - startDeg, 359.99)
  const toPoint = (r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
  }
  const end = startDeg + sweep
  const largeArc = sweep > 180 ? 1 : 0
  const [x1, y1] = toPoint(outerR, startDeg)
  const [x2, y2] = toPoint(outerR, end)
  const [x3, y3] = toPoint(innerR, end)
  const [x4, y4] = toPoint(innerR, startDeg)
  return [
    `M${x1} ${y1}`,
    `A${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
    `L${x3} ${y3}`,
    `A${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
    "Z",
  ].join(" ")
}

/**
 * Whether a part of a pie stands out while a legend item is hovered. The
 * highlight is a source's key, "carbonFree" or "fossil", and a part is either
 * one source or every carbon-free or fossil source together
 */
function isEmphasized(highlight, { key, clean }) {
  if (!highlight) {
    return true
  }
  if (highlight === "carbonFree") {
    return clean
  }
  if (highlight === "fossil") {
    return !clean
  }
  return highlight === key
}

/**
 * The percent to show in the middle of a pie: the highlighted source's share,
 * all fossil fuels together, or the carbon-free share by default
 */
function getHighlightPercent(generation, highlight) {
  if (!highlight || highlight === "carbonFree") {
    return generation.carbonFree
  }
  if (highlight === "fossil") {
    return sources
      .filter(({ clean }) => !clean)
      .reduce((acc, { key }) => acc + generation[key], 0)
  }
  return generation[highlight]
}

/**
 * A small version of the state page's power sources chart, with the
 * carbon-free share in the middle. When detailed, it has an outer ring of each
 * source and an inner green arc for the carbon-free share, otherwise just one
 * ring of carbon-free green and fossil fuel grey. Parts other than the
 * highlighted legend item fade out
 */
function MiniPie({ cx, cy, r, generation, detailed, highlight }) {
  const total = sources.reduce((acc, { key }) => acc + generation[key], 0)
  if (total <= 0) {
    return null
  }

  // A small gap between slices, like the full chart, skipped for tiny ones
  const gapDeg = 1.5
  let angle = 0
  const slices = sources
    .filter(({ key }) => generation[key] > 0)
    .map(source => {
      const sweep = (generation[source.key] / total) * 360
      const start = angle
      angle += sweep
      const gap = sweep > gapDeg * 2 ? gapDeg / 2 : 0
      return { ...source, start: start + gap, end: start + sweep - gap }
    })

  const cleanDeg = (generation.carbonFree / total) * 360

  const fadeClass = part =>
    isEmphasized(highlight, part)
      ? "overlay-map-part"
      : "overlay-map-part -faded"
  // The simple ring's two parts, which stand in for every clean or fossil source
  const cleanPart = { key: "carbonFree", clean: true }
  const fossilPart = { key: "fossil", clean: false }

  return (
    <g className="mini-pie">
      <circle cx={cx} cy={cy} r={r + 1.5} className="mini-pie-bg" />
      {detailed ? (
        <>
          {slices.map(slice => (
            <path
              key={slice.key}
              d={arcPath(cx, cy, r * 0.74, r, slice.start, slice.end)}
              fill={slice.color}
              className={fadeClass(slice)}
            />
          ))}
          {cleanDeg > 0 && (
            <path
              d={arcPath(cx, cy, r * 0.56, r * 0.68, 0, cleanDeg)}
              fill={carbonFreeColor}
              className={
                !highlight || highlight === "carbonFree"
                  ? "overlay-map-part"
                  : "overlay-map-part -faded"
              }
            />
          )}
        </>
      ) : (
        <>
          {cleanDeg < 360 && (
            <path
              d={arcPath(cx, cy, r * 0.62, r, cleanDeg, 360)}
              fill={fossilColor}
              className={fadeClass(fossilPart)}
            />
          )}
          {cleanDeg > 0 && (
            <path
              d={arcPath(cx, cy, r * 0.62, r, 0, cleanDeg)}
              fill={carbonFreeColor}
              className={fadeClass(cleanPart)}
            />
          )}
        </>
      )}
      <text
        x={cx}
        y={cy}
        dominantBaseline="central"
        textAnchor="middle"
        className="mini-pie-label"
        style={{ fontSize: r * 0.42 }}
      >
        {getHighlightPercent(generation, highlight)}%
      </text>
    </g>
  )
}

/** The tooltip's contents: the carbon-free share and each source's share */
function TooltipContents({ generation }) {
  if (!generation) {
    return <div>Data not available</div>
  }

  const shownSources = sources
    .filter(({ key }) => generation[key] > 0)
    .sort((a, b) => generation[b.key] - generation[a.key])

  return (
    <>
      <div className="overlay-map-tooltip-total">
        {generation.carbonFree}% carbon-free in {generation.year}
      </div>
      <table>
        <tbody>
          {shownSources.map(source => (
            <tr key={source.key}>
              <td>
                <Swatch color={source.color} />
                {source.name}
              </td>
              <td className="text-right pl-3">{generation[source.key]}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

/**
 * A map of the US with a small power sources pie over each state, showing its
 * carbon-free share of power generation
 *
 * @param generationByState An object of state slug to its latest year's
 * generation percentages, e.g.
 *
 * {
 *   illinois: {
 *     year: number;
 *     all_solar: number;
 *     ...every other source's percent
 *     carbonFree: number;
 *   }
 * }
 *
 * @param nationalPct The carbon-free share for the US as a whole
 * @param trends      Optional trends, see trends.js
 */
const PowerPiesMap = ({ generationByState, nationalPct, trends }) => {
  // Start with just the carbon-free share, showing every source on hover
  const [showAllSources, setShowAllSources] = useState(false)
  // The legend item whose slices stand out on every pie
  const { highlight, legendItemProps, clearHighlight } = useLegendHighlight()

  return (
    <div className="overlay-map-section">
      <div className="overlay-map-controls">
        <label>
          <input
            type="checkbox"
            checked={showAllSources}
            onChange={event => {
              setShowAllSources(event.target.checked)
              // The other legend's items don't apply
              clearHighlight()
            }}
          />
          Show all power types
        </label>
      </div>

      <ScaleLegend
        title="Carbon-free share of power"
        nationalPct={nationalPct}
      />

      {showAllSources ? (
        <ul className="overlay-map-legend">
          {sources.map(source => (
            <li key={source.key} {...legendItemProps(source.key)}>
              <Swatch color={source.color} />
              {source.name}
            </li>
          ))}
          <li {...legendItemProps("carbonFree")}>
            <Swatch className="-ring" />
            Carbon-free share
          </li>
        </ul>
      ) : (
        <ul className="overlay-map-legend">
          <li {...legendItemProps("carbonFree")}>
            <Swatch color={carbonFreeColor} />
            Carbon-free (solar, wind, nuclear, hydropower)
          </li>
          <li {...legendItemProps("fossil")}>
            <Swatch color={fossilColor} />
            Fossil fuels
          </li>
          <li className="text-secondary">Hover a state for details</li>
        </ul>
      )}

      <StateOverlayMap
        ariaLabel="Map of the share of carbon-free power in each state"
        trends={trends}
        trendOffset={{
          main: pieRadius + 7,
          callout: calloutRadius + 7,
        }}
        // Shade states like the other share maps, by the carbon-free share
        getStateFill={location => {
          const generation = generationByState[location.id]
          return generation ? getShadeColor(generation.carbonFree) : undefined
        }}
        getStateLabel={location => {
          const generation = generationByState[location.id]
          return generation
            ? `${location.name}: ${generation.carbonFree}% carbon-free power`
            : `${location.name}: data not available`
        }}
        renderMarker={({ location, cx, cy, isCallout, isHovered }) => {
          const generation = generationByState[location.id]
          if (!generation) {
            return null
          }
          return (
            <MiniPie
              cx={cx}
              cy={cy}
              r={isCallout ? calloutRadius : pieRadius}
              generation={generation}
              detailed={showAllSources || isHovered}
              highlight={highlight}
            />
          )
        }}
        renderTooltip={location => (
          <TooltipContents generation={generationByState[location.id]} />
        )}
      />

      <span className="text-secondary keyText">
        Source: {getShortCitation("power-generation")}
      </span>
    </div>
  )
}

export default PowerPiesMap
