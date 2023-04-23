import React from "react"
import { graphql } from "gatsby"

import { slugToTitle } from "../helper-functions"
// Sim city power plant icons
import OilPlantImg from "../images/oil-plant.png"
import GasPlantImg from "../images/gas-plant.png"
import CoalPlantImg from "../images/coal-plant.png"

import PowerIcon from "../images/icons/power-cord.svg"
import CloudIcon from "../images/icons/cloud.svg"
import BackIcon from "../images/icons/arrow-left.svg"
import BackIconWhite from "../images/icons/arrow-left-white.svg"

import Layout from "./layout"
import SEO from "./seo"
import NewTabIcon from "./new-tab-icon"
import { getShortCitation } from "../constants/source-citations"

/**
 * Helpful stats we use to provide context about power plant metrics
 */
const ContextStats = {
  netGeneration: {
    avgAmericanHomeMwhPerYear: 11,
    source:
      "https://www.eia.gov/energyexplained/use-of-energy/electricity-use-in-homes.php",
  },
  co2eEmissions: {
    avgAmericanCarEmissionsTonsPerYear: 4.6,
    source:
      "https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle",
  },
}

const PowerPlantDetailPage = ({ pageContext, data }) => {
  const PowerPlantStateSlug = data.allPowerPlantsJson.edges[0].node.state
  const PowerPlant = data.allPowerPlantsJson.edges[0].node.power_plants.find(
    plant => plant.slug === pageContext.powerPlantSlug
  )

  const StateFaceClass = PowerPlantStateSlug.toLowerCase().replaceAll(" ", "-")
  const PowerPlantStateTitle = slugToTitle(PowerPlantStateSlug)

  // t=k sets the map to sattelite view, then we specify a query of  Lat,Long
  const GoogleMapsLink = `https://maps.google.com/?t=k&q=${PowerPlant.Latitude},${PowerPlant.Longitude}`

  /** Calculate comparison stats */
  const NetGenerationInt = parseInt(
    PowerPlant.Plant_annual_net_generation__MWh_.replaceAll(",", "")
  )
  const NetGenerationEquivalentHomes =
    NetGenerationInt / ContextStats.netGeneration.avgAmericanHomeMwhPerYear

  const CO2eEmissionsInt = parseInt(
    PowerPlant.Plant_annual_CO2_equivalent_emissions__tons_.replaceAll(",", "")
  )
  const EmissionsEquivalentCars =
    CO2eEmissionsInt /
    ContextStats.co2eEmissions.avgAmericanCarEmissionsTonsPerYear

  return (
    <Layout>
      <SEO title={PowerPlant.plant_name + " Power Plant | Decarb My State"} />

      <div className="power-plant-page">
        <a
          href={`/${PowerPlantStateSlug}#power`}
          className="btn btn-outline-dark font-weight-bold"
        >
          <div className="back-icon">
            <img src={BackIcon} alt="" />
            <img src={BackIconWhite} className="-white" alt="" />
          </div>
          Back to {PowerPlantStateTitle} Power Details
        </a>
        <div className="top-row">
          <div className="power-plant-profile">
            {PowerPlant.fossil_fuel_category.toLowerCase() === "oil" && (
              <img src={OilPlantImg} alt="Oil power plant" />
            )}
            {PowerPlant.fossil_fuel_category.toLowerCase() === "gas" && (
              <img src={GasPlantImg} alt="Gas power plant" />
            )}
            {PowerPlant.fossil_fuel_category.toLowerCase() === "coal" && (
              <img src={CoalPlantImg} alt="Coal power plant" />
            )}

            <div
              className={"state-icon sf-" + StateFaceClass}
              aria-hidden="true"
            ></div>
          </div>

          <div>
            <h1 id="main" className="mb-0">
              {PowerPlant.plant_name}
            </h1>

            <div className="h5 mb-0 font-weight-bold">
              <span className="text-capitalize">
                {PowerPlant.fossil_fuel_category.toLowerCase()}
              </span>{" "}
              Power Plant
            </div>
            <div>
              {PowerPlant.county} County, {PowerPlantStateTitle}
            </div>

            <a href={GoogleMapsLink} target="_blank" rel="noreferrer">
              View on Google Maps
              <NewTabIcon />
            </a>
          </div>
        </div>

        <p className="mt-2 text-secondary">
          Power Plant Data Source: {getShortCitation("power-plants")}
        </p>

        <div className="stat-panel">
          <h2 className="h4">Quick Stats</h2>

          <div className="quick-stats-cont">
            <img src={PowerIcon} className="stat-icon" alt="" />

            <img src={CloudIcon} className="stat-icon" alt="" />

            <dl>
              <dt>Capacity</dt>
              <dd>{PowerPlant.capacity_mw.toLocaleString()} Megawatts</dd>

              <dt>Annual Net Generation</dt>
              <dd className="mb-0">
                {PowerPlant.Plant_annual_net_generation__MWh_}
                &nbsp;MWh (Megawatt Hours)
              </dd>

              <p className="context-msg">
                <strong>Context:</strong> That&apos;s equivalent to the annual
                power demand of{" "}
                {Math.round(NetGenerationEquivalentHomes).toLocaleString()}{" "}
                American homes (11 MWh each,{" "}
                <a
                  href={ContextStats.netGeneration.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  source: EIA
                  <NewTabIcon />
                </a>
                )
              </p>

              <dt className="mt-4">
                Annual CO<sub>2</sub> equivalent emissions
              </dt>
              <dd className="mb-0">
                {CO2eEmissionsInt.toLocaleString()}
                &nbsp;metric tons CO<sub>2</sub> equivalent
              </dd>

              <p className="context-msg">
                <strong>Context:</strong> That&apos;s equivalent to the annual
                emissions of about{" "}
                {Math.round(EmissionsEquivalentCars).toLocaleString()} American
                cars (4.6 metric tons each,{" "}
                <a
                  href={ContextStats.co2eEmissions.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  source: EPA
                  <NewTabIcon />
                </a>
                )
              </p>
            </dl>
          </div>
        </div>
        <div className="stat-panel">
          <h2 className="h4">Detailed Emissions</h2>

          <dl className="detailed-emissions">
            <div>
              <dt>
                Annual CO<sub>2</sub> emissions
              </dt>
              <dd>
                {PowerPlant.Plant_annual_CO2_emissions__tons_}
                &nbsp;metrics tons CO<sub>2</sub>
              </dd>
            </div>

            <div>
              <dt>
                Annual SO<sub>2</sub> (Sulfer Dioxide) emissions
              </dt>
              <dd>{PowerPlant.Plant_annual_SO2_emissions__tons_} tons</dd>
            </div>

            <div>
              <dt>Annual NOx (Nitrogen Oxide) emissions</dt>
              <dd>{PowerPlant.Plant_annual_NOx_emissions__tons_} tons</dd>
            </div>

            <div>
              <dt>
                Annual N<sub>2</sub>O (Nitrous Oxide) emissions
              </dt>
              <dd>{PowerPlant.Plant_annual_N2O_emissions__lbs_} lbs</dd>
            </div>

            <div>
              <dt>Annual CH4 (Methane) emissions</dt>
              <dd>{PowerPlant.Plant_annual_CH4_emissions__lbs_} lbs</dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  )
}

export default PowerPlantDetailPage

export const query = graphql`
  query PowerPlantQuery($powerPlantSlug: String) {
    allPowerPlantsJson(
      filter: { power_plants: { elemMatch: { slug: { eq: $powerPlantSlug } } } }
    ) {
      edges {
        node {
          state
          power_plants {
            slug
            plant_name
            fossil_fuel_category
            county
            capacity_mw
            Plant_annual_net_generation__MWh_
            Plant_annual_SO2_emissions__tons_
            Plant_annual_NOx_emissions__tons_
            Plant_annual_N2O_emissions__lbs_
            Plant_annual_CH4_emissions__lbs_
            Plant_annual_CO2_emissions__tons_
            Plant_annual_CO2_equivalent_emissions__tons_
            Longitude
            Latitude
          }
        }
      }
    }
  }
`
