import React from "react"

import ShareShadeMap from "./share-shade-map"

/**
 * A map of the US shading each state by the share of its homes heated without
 * burning fossil fuels, with the share written over it
 *
 * @param cleanHomesByState An object of state slug to its latest year's homes,
 * e.g.
 *
 * {
 *   illinois: {
 *     year: number;
 *     homes: number;
 *     cleanHomes: number;
 *     pct: number; // fossilFreeHeatingPct, like the state pages
 *     firstYear: number;
 *     firstPct: number; // The share in the first year of data
 *   }
 * }
 *
 * @param nationalPct The share for the US as a whole
 * @param trends      Optional trends, see trends.js
 */
const CleanHomesMap = ({ cleanHomesByState, nationalPct, trends }) => (
  <ShareShadeMap
    shareByState={cleanHomesByState}
    nationalPct={nationalPct}
    trends={trends}
    legendTitle="Share of homes heated without fossil fuels"
    ariaLabel="Map of the share of homes heated without fossil fuels in each state"
    describe={pct => `${pct}% of homes heat without fossil fuels`}
    getTooltipRows={entry => [
      ["Fossil-free homes", entry.cleanHomes.toLocaleString()],
      ["All homes", entry.homes.toLocaleString()],
      ...(entry.firstPct != null
        ? [[`In ${entry.firstYear}`, `${entry.firstPct}%`]]
        : []),
    ]}
    sourceSlug="home-heating"
  />
)

export default CleanHomesMap
