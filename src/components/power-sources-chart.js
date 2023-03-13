import React from "react"

/**
 * A pie chart that shows the sources of power generation for a given state.
 *
 * @param placeTitle {string} The name of the state
 *
 * @param latestGeneration An object with the following keys:
 *
 * {
 *   coal_percent: number;
 *   hydro_electric_percent: number;
 *   natural_gas_percent: number;
 *   nuclear_percent: number;
 *   petro_liquids_percent: number;
 *   wind_percent: number;
 *   all_solar_percent: number;
 *   year: number;
 * }
 *
 */
const PowerSourcesChart = ({ placeTitle, latestGeneration }) => {
  return (
    <ul>
      <li>{ latestGeneration.coal_percent }% Coal</li>
      <li>{ latestGeneration.hydro_electric_percent }% Hydro-electric</li>
      <li>{ latestGeneration.natural_gas_percent }% Natural Gas</li>
      <li>{ latestGeneration.nuclear_percent }% Nuclear</li>
      <li>{ latestGeneration.petro_liquids_percent }% Oil</li>
      <li>{ latestGeneration.wind_percent }% Wind</li>
      <li>{ latestGeneration.all_solar_percent }% Solar</li>
      <li>Source EIA, { latestGeneration.year }</li>
    </ul>
  )
}

export default React.memo(PowerSourcesChart)
