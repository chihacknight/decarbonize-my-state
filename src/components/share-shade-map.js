import React from "react"

import StateOverlayMap from "./state-overlay-map"
import { getShortCitation } from "../constants/source-citations"

/** Light to dark green color stops, evenly spaced along the scale */
const colorStops = ["#f2f9ec", "#c2e4b0", "#7fc77a", "#3a9c4d", "#11632d"]

function hexToRgb(hex) {
  const num = parseInt(hex.slice(1), 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

/** The green for a share, from 0 (lightest) to scaleMax (darkest) */
export function getShadeColor(pct, scaleMax = 100) {
  const position =
    Math.min(Math.max(pct / scaleMax, 0), 1) * (colorStops.length - 1)
  const index = Math.min(Math.floor(position), colorStops.length - 2)
  const mix = position - index
  const from = hexToRgb(colorStops[index])
  const to = hexToRgb(colorStops[index + 1])
  const rgb = from.map((value, i) => Math.round(value + (to[i] - value) * mix))
  return `rgb(${rgb.join(",")})`
}

/**
 * A gradient legend for the color scale, with a mark for the national share
 * so each state reads as above or below it
 *
 * @param title       Shown above the scale
 * @param scaleMax    The share at the darkest end
 * @param nationalPct The share for the US as a whole, or null to leave it out
 */
export function ScaleLegend({ title, scaleMax = 100, nationalPct }) {
  // Whole percents for a small scale, quarters for a full one
  const step = scaleMax <= 10 ? 1 : 25
  const ticks = []
  for (let tick = 0; tick <= scaleMax; tick += step) {
    ticks.push(tick)
  }
  const gradient = colorStops
    .map((color, i) => `${color} ${(i / (colorStops.length - 1)) * 100}%`)
    .join(", ")

  return (
    <div className="share-legend">
      <div className="share-legend-title">{title}</div>
      <div className="share-legend-scale">
        {nationalPct != null && (
          <div
            className="share-legend-national"
            style={{ left: `${(nationalPct / scaleMax) * 100}%` }}
          >
            <span>US {nationalPct}%</span>
          </div>
        )}
        <div
          className="share-legend-bar"
          style={{ background: `linear-gradient(to right, ${gradient})` }}
        />
        <div className="share-legend-ticks">
          {ticks.map(tick => (
            <span key={tick} style={{ left: `${(tick / scaleMax) * 100}%` }}>
              {tick}%
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * A state's share as a label: over the state itself, or next to a swatch of
 * its color for the small states stacked down the side
 */
function ShareLabel({ cx, cy, pct, color, isCallout }) {
  if (isCallout) {
    return (
      <g>
        <rect
          x={cx - 6}
          y={cy - 6}
          width={12}
          height={12}
          rx={2}
          fill={color}
          className="share-swatch"
        />
        <text
          x={cx + 9}
          y={cy}
          dominantBaseline="central"
          className="mini-bar-label"
          style={{ fontSize: 9 }}
        >
          {pct}%
        </text>
      </g>
    )
  }

  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      className="mini-bar-label"
      style={{ fontSize: 10 }}
    >
      {pct}%
    </text>
  )
}

/**
 * A map of the US shading each state green by a share, like of its cars that
 * are electric, with the share written over it
 *
 * @param shareByState  An object of state slug to at least { pct: number },
 *                      not including the US as a whole
 * @param nationalPct   The share for the US as a whole, or null
 * @param scaleMax      The share at the darkest green
 * @param legendTitle   What the share is of, shown over the legend
 * @param ariaLabel     The map's label for screen readers
 * @param describe      Function of a share, e.g. 4.2, to a short description
 *                      like "4.2% of cars are electric"
 * @param getTooltipRows Function of a state's entry to [label, value] rows for
 *                      its tooltip, under the description
 * @param sourceSlug    The data source's citation slug
 * @param trends        Optional trends to show by each label, see trends.js
 */
const ShareShadeMap = ({
  shareByState,
  nationalPct,
  scaleMax = 100,
  legendTitle,
  ariaLabel,
  describe,
  getTooltipRows,
  sourceSlug,
  trends,
}) => {
  // Rank states from the highest share down
  const ranked = Object.keys(shareByState).sort(
    (a, b) => shareByState[b].pct - shareByState[a].pct
  )

  return (
    <div className="overlay-map-section">
      <ScaleLegend
        title={legendTitle}
        scaleMax={scaleMax}
        nationalPct={nationalPct}
      />

      <StateOverlayMap
        ariaLabel={ariaLabel}
        trends={trends}
        // Past the end of labels like "4.2%", or left of the callout swatches
        trendOffset={{ main: 20, callout: 12 }}
        getStateLabel={location => {
          const entry = shareByState[location.id]
          return entry
            ? `${location.name}: ${describe(entry.pct)}`
            : `${location.name}: data not available`
        }}
        getStateFill={location => {
          const entry = shareByState[location.id]
          return entry ? getShadeColor(entry.pct, scaleMax) : undefined
        }}
        renderMarker={({ location, cx, cy, isCallout }) => {
          const entry = shareByState[location.id]
          if (!entry) {
            return null
          }
          return (
            <ShareLabel
              cx={cx}
              cy={cy}
              pct={entry.pct}
              color={getShadeColor(entry.pct, scaleMax)}
              isCallout={isCallout}
            />
          )
        }}
        renderTooltip={location => {
          const entry = shareByState[location.id]
          if (!entry) {
            return <div>Data not available</div>
          }
          const rows = [
            ...getTooltipRows(entry),
            ["Rank", `${ranked.indexOf(location.id) + 1} of ${ranked.length}`],
          ]
          if (nationalPct) {
            rows.push([
              "Vs. US share",
              `${Math.round((entry.pct / nationalPct) * 10) / 10}×`,
            ])
          }
          return (
            <>
              <div className="overlay-map-tooltip-total">
                {describe(entry.pct)}
                {entry.year ? ` in ${entry.year}` : ""}
              </div>
              <table>
                <tbody>
                  {rows.map(([label, value]) => (
                    <tr key={label}>
                      <td>{label}</td>
                      <td className="text-right pl-3">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )
        }}
      />

      <span className="text-secondary keyText">
        Source: {getShortCitation(sourceSlug)}
      </span>
    </div>
  )
}

export default ShareShadeMap
