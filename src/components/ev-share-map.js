import React from "react"

import ShareShadeMap from "./share-shade-map"

/**
 * Every state is still well under 5% electric, so the scale runs from 0 to the
 * top state's share, rounded up to a whole percent, rather than to 100%.
 * Otherwise every state would be the same pale color
 */
const getScaleMax = evShareByState =>
  Math.max(
    1,
    Math.ceil(Math.max(...Object.values(evShareByState).map(({ pct }) => pct)))
  )

/**
 * A map of the US shading each state by the share of its cars that are
 * electric, with the share written over it
 *
 * @param evShareByState An object of state slug to its latest year's cars,
 * not including the US as a whole, e.g.
 *
 * {
 *   illinois: {
 *     year: number;
 *     cars: number;
 *     evs: number;
 *     pct: number; // Rounded to one decimal, like the state pages
 *     firstYear: number;
 *     firstPct: number; // The share in the first year of data
 *   }
 * }
 *
 * @param nationalPct The share for the US as a whole
 * @param trends      Optional trends, see trends.js
 */
const EvShareMap = ({ evShareByState, nationalPct, trends }) => (
  <ShareShadeMap
    shareByState={evShareByState}
    nationalPct={nationalPct}
    trends={trends}
    scaleMax={getScaleMax(evShareByState)}
    legendTitle="Share of cars that are electric"
    ariaLabel="Map of the share of cars that are electric in each state"
    describe={pct => `${pct}% of cars are electric`}
    getTooltipRows={ev => [
      ["Electric vehicles", ev.evs.toLocaleString()],
      ["All cars", ev.cars.toLocaleString()],
      ...(ev.firstPct != null
        ? [[`In ${ev.firstYear}`, `${ev.firstPct}%`]]
        : []),
    ]}
    sourceSlug="vehicles"
  />
)

export default EvShareMap
