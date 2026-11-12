import React, { useEffect, useRef, useState } from "react"
import { graphql, Link } from "gatsby"
import Scrollspy from "react-scrollspy"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"

import { slugToTitle, numberToHumanString } from "../helper-functions"
import SingleBarChart from "../components/singlebar"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SimpleAreaChart from "../components/simpleareachart"
import { getShortCitation } from "../constants/source-citations"
import { getTerminologyHover } from "../constants/terminology-list"

import AlreadyElectrifiedChart from "./already-electrified-chart"
import PowerSourcesChart from "./power-sources-chart"
import EvGrowthChart from "./ev-growth-chart"
import InfoHover from "./info-hover"
import PowerMixChart from "./power-mix-chart"
import RenewablesProgressChart from "./renewables-progress-chart"
import HeatingTrendChart from "./heating-trend-chart"
import ChartDetails from "./chart-details"
import PowerTradeNote from "./power-trade-note"
import SectionProgressBar from "./section-progress-bar"
import DisplayPlants from "./display-plants"

/**
 * Images - suffix with Img for clarity from actual JS files/variables
 */

import CoalTransitionImg from "../images/coal-plant-transition.png"

// Sim city power plant icons
import OilPlantImg from "../images/oil-plant.png"
import GasPlantImg from "../images/gas-plant.png"
import CoalPlantImg from "../images/coal-plant.png"
import PowerPlantMap from "../images/dirty-power-plants.jpg"

// New images
import DirtyPowerPlantImg from "../images/dirty-power-plant.png"

const currentYear = new Date().getFullYear()

// The years we have till our zero goal of 20
const yearsToTarget = 2050 - currentYear

// We want to get to 0 by 2050 and we use our current emissions as a start,
// so the % to cut by is 100 divided by the number of years we have
const cutPerYearPrcnt = (100 / yearsToTarget).toFixed(1)

export default function StateDetailsPage({ location, data }) {
  /**
   * Properties to pass to the main desktop graph, which updates as you scroll
   */
  const [scrollGraphSettings, setScrollGraphSettings] = useState({
    active: "buildings",
    green: [],
  })

  /**
   * On mobile the sticky header starts as just a larger state name, then
   * shrinks and shows the section progress bar once the line above the first
   * section scrolls up under it. CSS transitions handle the change, see
   * state-details.css
   *
   * This could be CSS only (a scroll-driven animation flipping a custom
   * property, read by a container style query), but as of Firefox 160 style
   * queries don't update when an animation changes the property
   */
  const stickyHeaderRef = useRef(null)
  const sectionsStartRef = useRef(null)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true)

  useEffect(() => {
    const header = stickyHeaderRef.current
    const line = sectionsStartRef.current
    if (!header || !line || !("IntersectionObserver" in window)) {
      setIsHeaderExpanded(false)
      return
    }

    // Watch the line against everything below the sticky header (which sits
    // under the site header, its sticky top), extending far past the bottom
    // of the screen. The line is then "intersecting" whenever it's below the
    // header, so even jumps past it (like following a link to a section)
    // cross the area's edge and update the header
    const headerBottom =
      parseFloat(getComputedStyle(header).top) + header.offsetHeight
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeaderExpanded(entry.isIntersecting),
      { rootMargin: `-${headerBottom}px 0px 1000000px 0px` }
    )
    observer.observe(line)
    return () => observer.disconnect()
  }, [])

  // place info and string
  const currentStateSlug = location.pathname.split("/")[1]
  // clean up title as needed
  const placeTitle = slugToTitle(currentStateSlug)
  const stateFaceClass = currentStateSlug.toLowerCase().replaceAll(" ", "-")

  // Each json loads in as an allSomethingJson and is filtered for
  // data relevant to this state, which is great!
  // the first edge node will have the relevant data,
  // so we can just take the first index

  // #### EMISSIONS ####
  const emissionsByYear = data.allEmissionsJson.edges[0].node.emissionsByYear
  const latestEmissions = emissionsByYear[emissionsByYear.length - 1]
  // desstructure out the different emissions categories for simplicity below
  const {
    buildings: buildingsEmissions,
    dirty_power: dirtyPowerEmissions,
    dumps_farms_industrial_other: farmsDumpsOtherEmissions,
    transportation: transportionEmissions,
  } = latestEmissions

  // sum, then make nice percentages
  const sumOfEmissions =
    buildingsEmissions +
    dirtyPowerEmissions +
    farmsDumpsOtherEmissions +
    transportionEmissions
  const buildingsPrcnt = ((buildingsEmissions / sumOfEmissions) * 100).toFixed(
    0
  )
  const powerPrcnt = ((dirtyPowerEmissions / sumOfEmissions) * 100).toFixed(0)
  const transportPrcnt = (
    (transportionEmissions / sumOfEmissions) *
    100
  ).toFixed(0)
  const otherPrcnt = (
    (farmsDumpsOtherEmissions / sumOfEmissions) *
    100
  ).toFixed(0)

  const percentToCut = ((1 / yearsToTarget) * 100).toFixed(1)

  // #### VEHICLES ####
  const {
    Cars_All: carsAll,
    EV_Registration: evRegistration,
    byYear: vehiclesByYear,
  } = data.allVehiclesJson.edges[0].node

  const pctEv = Math.round((evRegistration / carsAll) * 100 * 10) / 10
  const pctNonEv = Math.round((100 - pctEv) * 10) / 10

  // calculate cars remaining to electrify
  const carsToElectrify = carsAll - evRegistration

  // string formatting
  const carsCountStr = numberToHumanString(carsAll)
  const carsToElectrifyStr = numberToHumanString(carsToElectrify)
  const carsPerYear = numberToHumanString(
    Math.ceil((carsToElectrify * cutPerYearPrcnt) / 100)
  )
  const evCountStr = numberToHumanString(evRegistration)

  // #### BUILDINGS ####
  // We track each home's main heating source, not every appliance
  const {
    homes,
    fossilHeatingPct,
    fossilFreeHeatingPct,
    byYear: heatingByYear,
  } = data.allBuildingsJson.edges[0].node

  // calculate homes whose heating is left to electrify
  const homesToElectrify = homes * (fossilHeatingPct / 100)

  // string formatting
  const homesCountStr = numberToHumanString(homes)
  const homesLeftToElectrifyStr = numberToHumanString(homesToElectrify)
  const homesPerYear = numberToHumanString(
    Math.ceil((homesToElectrify * cutPerYearPrcnt) / 100)
  )

  // #### POWER GENERATION ####
  const generationByYear = data.allPowerGenerationJson.edges[0].node.generation

  // Sort by newest first and grab the first record to get the latest generation
  const latestGeneration = generationByYear.sort((a, b) => b.year - a.year)[0]

  const firstGenerationYear = generationByYear[generationByYear.length - 1].year

  // How much electricity the state imports or exports, if we have it
  const tradeEdge = data.allTradeJson.edges[0]
  const trade = tradeEdge ? tradeEdge.node : null

  // Shown under the latest year's pie chart in both power sections, with one
  // source line under both, like the other sections
  const powerMixSection = (
    <>
      {trade && <PowerTradeNote trade={trade} placeTitle={placeTitle} />}
      <ChartDetails
        className="mt-3"
        label="View Power Generation Trends"
        title={`Power Generation Mix in ${placeTitle} (${firstGenerationYear}–${latestGeneration.year})`}
      >
        <PowerMixChart generationByYear={generationByYear} />
      </ChartDetails>
      <span className="mt-4 text-secondary keyText">
        Source: {getShortCitation("power-generation")}
      </span>
    </>
  )

  const carbonFreePercent =
    latestGeneration.all_solar_percent +
    latestGeneration.hydro_electric_percent +
    latestGeneration.nuclear_percent +
    latestGeneration.wind_percent

  // #### SOLAR PANELS & WIND TURBINES ####
  const targetBuilds = data.allTargetGenerationJson.edges[0].node

  // deconstruct object for simplicity. The _mw values are the capacity it
  // takes to generate each target or current GWh a year, estimated with
  // national capacity factors in get_target_generations.py
  const {
    total_gen_by_wind: targetGenByWind,
    perc_solar_target: percSolarTarget,
    perc_wind_target: percWindTarget,
    wind_capacity_factor: windCapacityFactor,
    solar_capacity_factor: solarCapacityFactor,
    target_wind_mw: targetGenByWindMW,
    target_solar_mw: targetGenBySolarMW,
    current_wind_mw: currentWindMW,
    current_solar_mw: currentSolarMW,
    capacityByYear,
  } = targetBuilds

  const solarToBuildMw = targetGenBySolarMW - currentSolarMW
  const windToBuildMw = targetGenByWindMW - currentWindMW

  // Clamp to zero since if we never want to say negative solar needs to be
  // built
  const solarPanelsBuildPerYear = Math.max(
    0,
    Math.round((targetGenBySolarMW - currentSolarMW) / yearsToTarget)
  )
  const windTurbinesBuildPerYear = Math.max(
    0,
    Math.round((targetGenByWindMW - currentWindMW) / yearsToTarget)
  )

  // getting percentages for chart
  // Note that we divide in half since 100% solar and 100% wind is 100% of total
  // not 200%
  const percToCleanTarget = (percSolarTarget + percWindTarget) / 2
  const totalRemaining = 100 - percToCleanTarget

  // converting values to strings
  const solarPanelsCountStr =
    targetGenBySolarMW !== undefined
      ? numberToHumanString(targetGenBySolarMW)
      : "?"
  const windTurbinesCountStr =
    targetGenByWindMW !== undefined
      ? numberToHumanString(targetGenByWindMW)
      : "?"
  const solarPanelsBuildPerYearStr =
    targetGenBySolarMW !== undefined
      ? numberToHumanString(solarPanelsBuildPerYear)
      : "?"

  const solarToBuildMwStr = numberToHumanString(solarToBuildMw)
  const windToBuildMwStr = numberToHumanString(windToBuildMw)

  const windTurbinesBuildPerYearStr =
    targetGenByWindMW !== undefined
      ? numberToHumanString(windTurbinesBuildPerYear)
      : "?"

  const currentSolarMWStr = numberToHumanString(currentSolarMW)
  const currentWindMWStr = numberToHumanString(currentWindMW)

  // #### Number of Turbines and Football-fields of solar panels. ####
  // https://www.usgs.gov/faqs/how-many-homes-can-average-wind-turbine-power
  // targetGenByWindMW is already capacity, so this is like for like
  const averageWindTurbineCapacityMw = 2.75
  const turbinesNeededNumber = numberToHumanString(
    Math.ceil(targetGenByWindMW / averageWindTurbineCapacityMw)
  )

  // Short version of the math above for the tooltip, the FAQ has the long one
  const capacityMathStr =
    `Wind and solar rarely run at full power: U.S. wind farms average ` +
    `${(windCapacityFactor * 100).toFixed(1)}% of their capacity and solar ` +
    `${(solarCapacityFactor * 100).toFixed(1)}% (EIA, 2025). So we divide ` +
    `the average power needed by those, then the wind by ` +
    `${averageWindTurbineCapacityMw} MW per turbine. Details in our FAQ.`

  // #### POWER PLANTS ####
  const powerPlants = data.allPowerPlantsJson.edges[0].node.power_plants

  powerPlants.sort((a, b) => b.capacity_mw - a.capacity_mw)

  const coalPlants = powerPlants.filter(
    plant => plant.fossil_fuel_category === "COAL"
  )
  const gasPlants = powerPlants.filter(
    plant => plant.fossil_fuel_category === "GAS"
  )
  const oilPlants = powerPlants.filter(
    plant => plant.fossil_fuel_category === "OIL"
  )

  /**
   * The section IDs that are scrollable - it's important this reflects the
   * actual sections or tracking gets real wacky
   */
  let scrollableSectionIds = [
    "buildings",
    "buildings-end",
    "transport",
    "transport-end",
    "power",
    "power-end",
    "other",
  ]

  if (powerPrcnt === "0") {
    scrollableSectionIds = scrollableSectionIds.filter(
      sect => sect !== "power-end"
    )
  }

  /**
   * Restyles the side graph as we scroll through the page, given a new target
   */
  function scrollTargetUpdated(scrollTarget) {
    let activeKey = "buildings"
    let greenKeys = []

    // Make sure we don't try using the scrollTarget if it's null
    if (!scrollTarget) {
      return
    }

    const targetId = scrollTarget.id

    if (!targetId) {
      console.error("Scroll target had no ID! Element was:", scrollTarget)
      setScrollGraphSettings({ active: activeKey, green: greenKeys })
      return
    }

    if (targetId === "buildings") {
      activeKey = "buildings"
      greenKeys = []
    } else if (targetId === "buildings-end") {
      activeKey = ""
      greenKeys = ["buildings"]
    } else if (targetId === "transport") {
      activeKey = "transportation"
      greenKeys = ["buildings"]
    } else if (targetId === "transport-end") {
      activeKey = ""
      greenKeys = ["buildings", "transportation"]
    } else if (targetId === "power") {
      activeKey = "dirty_power"
      greenKeys = ["buildings", "transportation"]
    } else if (targetId === "power-end") {
      activeKey = ""
      greenKeys = ["buildings", "transportation", "dirty_power"]
    } else if (targetId === "other") {
      activeKey = "dumps_farms_industrial_other"
      greenKeys = ["buildings", "transportation", "dirty_power"]
    }

    setScrollGraphSettings({ active: activeKey, green: greenKeys })
  }
  // Description will retain formatting, so this needs to be single line
  const descriptionText = `To get to zero by 2050, ${placeTitle} must cut climate pollution by ${cutPerYearPrcnt}% a year. Electrification can help us get there.`

  return (
    <Layout flushHeader>
      <SEO
        title={`${placeTitle} | Decarb My State`}
        description={descriptionText}
        image={"social-cards/" + placeTitle.toLowerCase() + ".jpg"}
      />

      <div
        ref={stickyHeaderRef}
        className={"sticky-header" + (isHeaderExpanded ? " -expanded" : "")}
      >
        <div className="d-flex align-items-center">
          <h1 id="main" className="d-flex align-items-center mr-4 mt-0 mb-0">
            <span
              className={"state-icon display-3 mr-4 sf-" + stateFaceClass}
              aria-hidden="true"
            ></span>
            <span className="title font-weight-bold h4 mb-0">{placeTitle}</span>
          </h1>

          <a className="btn btn-outline-secondary back-btn ml-3" href="/">
            Back <span className="d-none d-md-inline">to map</span>
          </a>
        </div>

        {/* Mobile and tablet only, desktop has the sticky side chart */}
        <div className="d-xl-none">
          <SectionProgressBar
            percents={{
              buildings: buildingsPrcnt,
              transportation: transportPrcnt,
              dirty_power: powerPrcnt,
              dumps_farms_industrial_other: otherPrcnt,
            }}
            activeKey={scrollGraphSettings.active}
            greenKeys={scrollGraphSettings.green}
          />
        </div>
      </div>

      {/* Intro Section */}
      <div className="col-12">
        <p className="h2 text-center font-weight-light mt-6 mb-5">
          To get to <strong>zero</strong> by 2050, {placeTitle} must cut
          emissions by <strong>{percentToCut}% a year</strong>
        </p>
      </div>

      {/* Make graph thinner */}
      <div className="col-lg-9 state-graph-section">
        <h2 className="h4">Emissions in {placeTitle}</h2>
        <p className="h6">
          Million metric tons of {getTerminologyHover("carbon-dioxide")}{" "}
          equivalent ({getTerminologyHover("mtco2e")}) emissions
        </p>
        <p className="small">
          <strong>Note:</strong> Grey area indicates missing data due to
          processing delays.
          <br />
          <span className="text-secondary">
            Source: {getShortCitation("emissions")}
          </span>
        </p>
        <SimpleAreaChart
          emissionsData={emissionsByYear}
          title={"Emissions in " + placeTitle}
        />
      </div>

      <div className="col-12">
        <p className="h1 font-weight-bold text-center mt-7">
          This is how we're going to do it
        </p>

        {/* Scrolling past this shows the mobile section progress bar */}
        <hr ref={sectionsStartRef} className="mt-7 mb-7" />
      </div>

      <div className="row state-details-main" id="state-details-main">
        {/**
         * Our main chart for desktop ONLY (others are hidden) this chart
         * should update as you scroll
         */}
        <div className="col-4 sticky-cont d-none d-xl-block">
          <div className="graph-title font-weight-bold mb-3">
            {placeTitle}'s climate pollution, by source
          </div>

          <SingleBarChart
            isSticky={true}
            emissionsData={latestEmissions}
            activeKey={scrollGraphSettings.active}
            greenKeys={scrollGraphSettings.green}
          />
          <br />
          <span className="text-secondary keyText">
            Source: {getShortCitation("emissions")}
          </span>
        </div>

        {/*
         * Right column on desktop, full width on mobile. This is a scroll spy
         * container to update the left graph
         */}
        <Scrollspy
          offset={-300}
          scrolledPastClassName={"scrolled-past"}
          items={scrollableSectionIds}
          currentClassName="is-current"
          onUpdate={scrollTargetUpdated}
          className="col-12 col-xl-7"
        >
          {/* Buildings Section */}
          <div id="buildings" className="scrollable-sect mt-5">
            <h2 className="h1 mb-6">Decarbonize Our Buildings</h2>

            <div className="row mt-5">
              <div className="col-12 col-md-6 d-block d-xl-none mb-6">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  activeKey={"buildings"}
                />
              </div>
              <div className="col h3">
                <p className="mt-2 mb-0">
                  <strong>{buildingsPrcnt}%</strong> of {placeTitle}'s climate
                  pollution comes from buildings.
                </p>

                <div className="d-flex align-items-end justify-content-around mt-5">
                  <div className="col-6 building-sheet -house"></div>
                  <div className="col-6 building-sheet -apartments"></div>
                </div>
              </div>
            </div>

            <p className="mt-6 mb-0">
              {/* Sourced from Rewiring America Electrify Everything in Your Home guide */}
              We burn <strong>fossil fuels</strong> to <strong>heat</strong> our
              air, water, and food.
            </p>

            <div className="d-flex align-items-end justify-content-between flex-wrap mt-5 mb-5">
              <div className="appliance-sheet -stove"></div>
              <div className="appliance-sheet -boiler"></div>
              <div className="appliance-sheet -heater"></div>
            </div>

            <p className="mt-6">
              To <strong>cut</strong> this pollution...
            </p>

            <p className="mt-4 mb-6 text-right">
              Let's <strong>electrify</strong> our <strong>heat</strong>!
            </p>

            <p className="mt-6">We'll replace...</p>
            <div className="mt-4 mb-4">
              <ul className="h4">
                <li>
                  Boilers and furnaces with{" "}
                  <strong>{getTerminologyHover("heat-pumps")}</strong>
                </li>
                <li>
                  Gas stoves with{" "}
                  <strong>{getTerminologyHover("induction-stoves")}</strong>
                </li>
              </ul>
            </div>

            <div className="d-flex align-items-end justify-content-between flex-wrap  mt-5 mb-5">
              <div className="appliance-sheet -stove -clean"></div>
              <div className="appliance-sheet -boiler -clean"></div>
              <div className="appliance-sheet -heater -clean"></div>
            </div>

            <p className="mt-0 mb-4 text-right">
              ...in all of {placeTitle}'s buildings.
            </p>

            <div className="d-flex align-items-end justify-content-around mt-5">
              <div className="col-6 building-sheet -house -clean"></div>
              <div className="col-6 building-sheet -apartments -clean"></div>
            </div>

            <p className="mt-7">
              Heating burns the most fuel in our homes, so let's start there. Of{" "}
              {placeTitle}'s {homesCountStr} homes,{" "}
              {fossilFreeHeatingPct.toFixed(1)}% already heat without burning
              any fuel, mostly with electricity!
            </p>

            <p className="mt-5">
              That means we need to{" "}
              <strong>
                electrify the heating in the remaining {homesLeftToElectrifyStr}{" "}
                homes in {placeTitle}
              </strong>
              . That's around {homesPerYear} per year.
            </p>
            <AlreadyElectrifiedChart
              label={"Homes With Electric Heating*"}
              electrifiedPct={fossilFreeHeatingPct}
              fossilPct={fossilHeatingPct}
            />
            <ChartDetails
              className="mt-5"
              label="View Home Heating Trends"
              title={`Homes With Electric Heating* in ${placeTitle} (${
                heatingByYear[0].year
              }–${heatingByYear[heatingByYear.length - 1].year})`}
              note={
                "The shaded bands are the survey's margin of error, and lines " +
                "are dashed where 2020 data is missing. A falling share can " +
                "mean more homes heating with fuel, not fewer with electric heat."
              }
            >
              <HeatingTrendChart byYear={heatingByYear} />
            </ChartDetails>
            <p className="mt-4 h6 text-muted">
              This counts each home's main heating source. Stoves, water
              heaters, and businesses aren't included yet.
            </p>
            <span className="mt-4 text-secondary keyText">
              Source: {getShortCitation("home-heating")}
            </span>
            {/* Explains the asterisk on "Electric Heating". A div, not a p, so
                it matches the source line's size */}
            <div className="mt-2 text-secondary keyText">
              *Electric heating also counts homes heated by solar and homes with
              no heating at all (common in Hawaii and Florida), since neither
              burns fuel.
            </div>
          </div>

          <div
            id="buildings-end"
            className="scrollable-sect change-text mt-8 mb-4"
          >
            <p className="h1 font-weight-bold text-center mt-6 mb-6">
              Electrifying all buildings cuts {buildingsPrcnt}% of the
              pollution.
            </p>

            <div className="mt-4 d-flex justify-content-center d-block d-xl-none">
              <SingleBarChart
                emissionsData={latestEmissions}
                greenKeys={["buildings"]}
              />
            </div>

            <hr className="d-xl-none mb-8" />
          </div>

          {/* Transportation Section */}
          <div id="transport" className="scrollable-sect mt-5">
            <h2 className="h1 mb-6">Decarbonize Our Transport</h2>

            <div className="row mt-5">
              {/* Make SingleBarChart full width on mobile */}
              <div className="col-12 col-md-6 d-block d-xl-none mb-6">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  activeKey="transportation"
                  greenKeys={["buildings"]}
                />
              </div>

              <div className="col h3">
                <p className="mt-2">
                  <strong>{transportPrcnt}%</strong> of {placeTitle}'s pollution
                  comes from cars, trucks, trains, and planes.
                </p>
                <p className="mt-6 mb-6 text-right">
                  But <strong>mostly</strong> from cars.
                </p>
              </div>
            </div>

            <div className="d-flex align-items-end justify-content-around flex-wrap mt-5">
              <div className="col-5 vehicles-sheet -car"></div>
              <div className="col-6 vehicles-sheet -truck"></div>
              <div className="col-8 vehicles-sheet -semi mt-5"></div>
            </div>

            <p className="mt-6">To cut this pollution,</p>

            <p className="mt-4 mb-5 text-right">
              your next car must be <strong>electric</strong>.
            </p>

            <p className="mt-5">
              Or consider going car-free with public transit, bikes/e-bikes, car
              share, or other alternatives!
            </p>

            <div className="d-flex align-items-end justify-content-around flex-wrap mt-5">
              <div className="col-5 vehicles-sheet -car -clean"></div>
              <div className="col-6 vehicles-sheet -truck -clean"></div>
              {/*<div className="col-8 vehicles-sheet -semi -clean mt-5"></div>*/}
              <div className="col-6 vehicles-sheet -e-streetcar mt-5"></div>
              <div className="col-3 vehicles-sheet -ebike mt-5"></div>
            </div>

            <p className="mt-5">
              There are {carsCountStr} vehicles in {placeTitle} and {evCountStr}{" "}
              are already electric ({pctEv}% of the total).
            </p>
            <p className="mt-5">
              <strong>
                We need to electrify (or replace) the remaining{" "}
                {carsToElectrifyStr} gas-powered vehicles.{" "}
              </strong>
              That's around {carsPerYear} a year.
            </p>

            <AlreadyElectrifiedChart
              label={"Vehicles Electrified"}
              electrifiedPct={pctEv}
              fossilPct={pctNonEv}
            />

            <ChartDetails
              className="mt-5"
              label="View EV Growth Trends"
              title={`EV Growth in ${placeTitle} (${vehiclesByYear[0].year}–${
                vehiclesByYear[vehiclesByYear.length - 1].year
              })`}
            >
              <EvGrowthChart byYear={vehiclesByYear} />
              {/* Explains the asterisk on "All Vehicles" in the chart. A div,
                  not a p, so it matches the source line's size */}
              <div className="mt-2 text-secondary keyText">
                *All Vehicles counts every registered light-duty vehicle (cars,
                SUVs, pickups and vans) of any fuel type. Heavy trucks, buses
                and motorcycles aren't included. Light-duty vehicles make up the
                majority of transportation emissions (about 57% nationally, per
                the EPA).
              </div>
            </ChartDetails>
            <span className="mt-4 text-secondary keyText">
              Source: {getShortCitation("vehicles")}
            </span>
          </div>

          <div
            id="transport-end"
            className="scrollable-sect change-text mt-8 mb-4"
          >
            <p className="h1 font-weight-bold text-center mt-6 mb-6">
              Electrifying all transportation cuts {transportPrcnt}% of the
              pollution.
            </p>

            <div className="mt-4 d-flex justify-content-center d-block d-xl-none">
              <SingleBarChart
                emissionsData={latestEmissions}
                greenKeys={["buildings", "transportation"]}
              />
            </div>

            <hr className="d-xl-none mt-8" />
          </div>

          {/* Power Section */}
          {/* Show normal intro section if power emissions > 0 */}
          {powerPrcnt > 0 && (
            <div id="power" className="scrollable-sect mt-5">
              <h2 className="h1 mb-6">Decarbonize Our Power</h2>

              <div className="row mt-5">
                {/* Make SingleBarChart full width on mobile */}
                <div className="col-12 col-md-6 d-block d-xl-none mb-6">
                  <SingleBarChart
                    emissionsData={latestEmissions}
                    activeKey="dirty_power"
                    greenKeys={["buildings", "transportation"]}
                  />
                </div>

                <div className="col">
                  <p className="mt-2">
                    <strong>{powerPrcnt}%</strong> of {placeTitle}'s pollution
                    comes from burning <strong>coal</strong>,{" "}
                    <strong>gas</strong>, and <strong>oil</strong> to make
                    power.
                  </p>

                  <div className="mt-5 text-center">
                    <img
                      className="img-fluid col-5"
                      src={DirtyPowerPlantImg}
                      alt="Dirty power plant"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-5">
                That's because of how power is generated in {placeTitle}{" "}
                <em>today</em>.
              </p>

              <h3 className="chart-title mt-5">
                Power Generation in the State of {placeTitle} (
                {latestGeneration.year})
              </h3>

              <PowerSourcesChart
                latestGeneration={latestGeneration}
                placeTitle={placeTitle}
                showSource={false}
              ></PowerSourcesChart>

              {powerMixSection}

              {carbonFreePercent > 0 && (
                <p className="mt-6">
                  But there's already{" "}
                  <strong>{carbonFreePercent}% carbon-free</strong> electricity
                  generation in {placeTitle}!
                </p>
              )}

              <p className="mt-6">
                To clean up the emissions from the polluting power plants we
                need to replace <strong>all fossil fuel power plants</strong>{" "}
                with solar and wind farms.
              </p>

              <p className="mt-5 mb-0">
                <img
                  className="img-fluid"
                  src={CoalTransitionImg}
                  title="We need to replace dirty power plants with
                clean ones (mostly wind and solar)"
                  alt="We need to replace dirty power plants with
                clean ones (mostly wind and solar)"
                />
              </p>

              <p className="mt-5 mb-8">
                ...and find good jobs for those workers.
              </p>

              <h3 className="h5">
                Current Fossil Fuel Power Plants in {placeTitle}
              </h3>

              {coalPlants.length > 0 && (
                <>
                  <p className="mt-5">
                    <strong>
                      {coalPlants.length} coal plant
                      {coalPlants.length !== 1 && "s"}{" "}
                    </strong>
                  </p>
                  <DisplayPlants
                    plants={coalPlants}
                    plantImage={CoalPlantImg}
                    stateSlug={currentStateSlug}
                  />
                </>
              )}

              {gasPlants.length > 0 && (
                <>
                  <p className="mt-5">
                    <strong>
                      {gasPlants.length} gas plant
                      {gasPlants.length !== 1 && "s"}
                    </strong>
                  </p>
                  <DisplayPlants
                    plants={gasPlants}
                    plantImage={GasPlantImg}
                    stateSlug={currentStateSlug}
                  />
                </>
              )}

              {oilPlants.length > 0 && (
                <>
                  <p className="mt-5">
                    <strong>
                      {oilPlants.length} oil plant
                      {oilPlants.length !== 1 && "s"}
                    </strong>
                  </p>
                  <DisplayPlants
                    plants={oilPlants}
                    plantImage={OilPlantImg}
                    stateSlug={currentStateSlug}
                  />
                </>
              )}

              <div className="card mt-5">
                <div className="card-body">
                  <a
                    href="https://bit.ly/dirty-power-plants-usa"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <p className="h5" style={{ display: "block" }}>
                      Find the dirty plants near you
                    </p>
                    <img className="img-fluid" src={PowerPlantMap} alt="" />
                  </a>
                </div>
              </div>
              <span className="mt-4 text-secondary keyText">
                Source: {getShortCitation("power-plants")}
              </span>

              <p className="mt-8">But wait!</p>

              <p className="mt-6">
                It's not enough to replace our power plants with wind and solar
                farms.
              </p>

              <p className="mt-6">
                To power our electric cars and buildings, we need{" "}
                <strong>two times</strong> the electricity we have today.
              </p>

              <p className="mt-6">
                In all, we'll need to build{" "}
                <strong>
                  {windTurbinesCountStr} {getTerminologyHover("megawatt")}
                </strong>{" "}
                of wind power and <strong>{solarPanelsCountStr} MW</strong> of
                solar {/* Keep the ? icon on the same line as the last word */}
                <span className="text-nowrap">
                  power.
                  {targetGenByWind !== undefined && (
                    <>
                      &nbsp;
                      <InfoHover
                        wide
                        ariaLabel={`How we got these numbers - ${capacityMathStr}`}
                      >
                        {capacityMathStr}
                      </InfoHover>
                    </>
                  )}
                </span>
              </p>

              <p className="mt-6">
                Since the average wind turbine provides 2.75 MW of peak
                capacity, {placeTitle} would need to install about{" "}
                <strong>{turbinesNeededNumber}</strong> turbines.
              </p>

              <p className="mt-5">
                Since {placeTitle} already has {currentWindMWStr} MW of wind and{" "}
                {currentSolarMWStr} MW of solar, that's {windToBuildMwStr} MW of
                wind power we need to build and {solarToBuildMwStr} MW of solar
                power. That's around{" "}
                <strong>{windTurbinesBuildPerYearStr} MW </strong>
                of wind power and{" "}
                <strong>{solarPanelsBuildPerYearStr} MW </strong>
                of solar power a year.
              </p>

              <p className="h4 mt-5 text-muted">
                <AlreadyElectrifiedChart
                  label={"MWs of Wind and Solar Built"}
                  electrifiedPct={percToCleanTarget}
                  fossilPct={totalRemaining}
                />
              </p>
              {targetGenByWind !== undefined && (
                <ChartDetails
                  className="mt-5"
                  label="View Wind and Solar Progress"
                  title={`Wind and Solar Built vs. Target in ${placeTitle} (${firstGenerationYear}–${latestGeneration.year})`}
                  note="Megawatts of capacity, estimated from generation with national capacity factors."
                >
                  <RenewablesProgressChart
                    capacityByYear={capacityByYear}
                    targetWindMw={targetGenByWindMW}
                    targetSolarMw={targetGenBySolarMW}
                    annualWindMw={windTurbinesBuildPerYear}
                    annualSolarMw={solarPanelsBuildPerYear}
                  />
                </ChartDetails>
              )}
              <span className="mt-4 text-secondary keyText">
                Source: {getShortCitation("power-generation")}
              </span>
            </div>
          )}
          {/* Show standard outro section if power emissions are non-zero */}
          {powerPrcnt > 0 && (
            <div
              id="power-end"
              className="scrollable-sect change-text mt-8 mb-4"
            >
              <p className="h1 font-weight-bold text-center mt-6 mb-6">
                Decarbonizing all dirty power cuts {powerPrcnt}% of the
                pollution.
              </p>
              <p className="text-center mt-6 mb-6">
                And gives us zero-emissions power we need to eliminate pollution
                from buildings and cars!
              </p>

              <div className="mt-5 d-flex justify-content-center d-block d-xl-none">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  greenKeys={["buildings", "transportation", "dirty_power"]}
                />
              </div>

              <hr className="d-xl-none mt-7" />
            </div>
          )}

          {/* Show special section if power emissions are zero */}
          {powerPrcnt === "0" && (
            <div id="power" className="scrollable-sect mt-5 mb-7">
              <h2 className="h1">Power</h2>
              <div className="mt-6 mb-4 text-center">
                {/* DC generates no power, and so has 0% carbon free % */}
                {carbonFreePercent === 0 && (
                  <p className="font-weight-bold">
                    {placeTitle} doesn't produce any power that creates climate
                    pollution! 😎
                  </p>
                )}

                {carbonFreePercent > 0 && (
                  <>
                    <p className="font-weight-bold">
                      {placeTitle} already produces {carbonFreePercent || 100}%
                      of it's power without making any climate pollution! 😎
                    </p>
                    <p className="h6 mb-5">
                      This means power accounts for &lt; 1% of their total
                      emissions.
                    </p>
                  </>
                )}
              </div>

              <h3 className="chart-title mt-5">
                Power Generation in the State of {placeTitle} (
                {latestGeneration.year})
              </h3>

              <PowerSourcesChart
                latestGeneration={latestGeneration}
                placeTitle={placeTitle}
                showSource={false}
              ></PowerSourcesChart>

              {powerMixSection}

              <div className="mt-6 text-center">
                <p className="h6 mt-3">
                  Check out another state to see how they can cut their power
                  emissions to zero.
                </p>

                <hr className="d-xl-none mt-7" />
              </div>
            </div>
          )}

          {/* Other Section */}
          <div id="other" className="scrollable-sect mt-5">
            <h2 className="h1 mb-6">Other Emissions</h2>

            <div className="row mt-5">
              {/* Make SingleBarChart full width on mobile */}
              <div className="col-12 col-md-6 d-block d-xl-none">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  activeKey="dumps_farms_industrial_other"
                  greenKeys={["buildings", "transportation", "dirty_power"]}
                />
              </div>

              <div className="col">
                <p className="mt-5">
                  The last <strong>{otherPrcnt}%</strong> of {placeTitle}'s
                  climate pollution comes from other sources...
                </p>
                <p className="mt-5">
                  This includes farming, landfills, industry, and leaks from gas
                  pipelines.
                </p>

                <p className="mt-5">
                  There's{" "}
                  <strong>
                    no <em>one</em> solution
                  </strong>{" "}
                  to solve these problems, but there are lots of great ideas:
                </p>

                <ul className="h5 mt-4">
                  {/* All emojis in this context are decorative, so they are
                      marked with aria-hidden */}
                  <li>
                    <span className="mr-2" aria-hidden="true">
                      🌾
                    </span>
                    No-till farming to keep CO<sub>2</sub> in the soil
                  </li>
                  <li>
                    <span className="mr-2" aria-hidden="true">
                      🗑️
                    </span>
                    Capturing methane leaks from landfills
                  </li>
                  <li>
                    <span className="mr-2" aria-hidden="true">
                      🧱
                    </span>
                    Capturing CO<sub>2</sub> to make emissions-free concrete
                  </li>
                  <li>
                    <span className="mr-2" aria-hidden="true">
                      🔩
                    </span>
                    Burning green hydrogen to make emissions-free steel
                  </li>
                  <li>
                    <span className="mr-2" aria-hidden="true">
                      💨
                    </span>
                    Plugging methane leaks from gas pipelines
                  </li>
                </ul>

                <p className="mt-5">
                  That doesn't mean there's no solution, it just means that{" "}
                  {getTerminologyHover("clean-electrification")} doesn't help
                  with these problems, and you could fill a whole book with
                  covering all of them. We need to encourage our politicians to
                  invest in researching new solutions and implementing existing
                  solutions to these problems!
                </p>
              </div>
            </div>
          </div>
        </Scrollspy>
      </div>

      <hr className="d-xl-none mt-7" />

      <section className="text-center mb-8">
        {/* This emoji is purely decorative */}
        <div className="h1 mt-7 mb-3">
          <span aria-hidden="true">✅</span>
        </div>
        <h2 className="h1 font-weight-bold">Ready to do your part?</h2>

        <p className="h4 mt-4">
          Learn how to <strong>electrify your own machines</strong> and{" "}
          <strong>pass local policy</strong> to electrify the rest
        </p>
        <Link className="btn btn-lg btn-success mt-4" to="/take-action">
          Take Action
        </Link>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query StateQuery($state: String) {
    allBuildingsJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          homes
          fossilHeatingPct
          fossilFreeHeatingPct
          byYear {
            year
            homes
            fossilFreeHeatingPct
            fossilFreeHeatingPctMoe
            fossilFreeHomes
            fossilFreeHomesMoe
            fossilHomes
            fossilHomesMoe
          }
        }
      }
    }
    allEmissionsJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          emissionsByYear {
            dirty_power
            buildings
            dumps_farms_industrial_other
            transportation
            year
          }
        }
      }
    }
    allVehiclesJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          Cars_All
          EV_Registration
          byYear {
            year
            Cars_All
            EV_Registration
          }
        }
      }
    }
    allPowerPlantsJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          power_plants {
            capacity_mw
            county
            fossil_fuel_category
            plant_name
            slug
            utility_name
          }
        }
      }
    }
    allTradeJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          state
          year
          totalSupply
          netGeneration
          netImports
          interstateNetImports
          internationalNetImports
          netImportsPct
          netExportsPct
        }
      }
    }
    allPowerGenerationJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          generation {
            all_solar
            coal
            hydro_electric
            natural_gas
            nuclear
            petro_liquids
            wind
            all_solar_percent
            coal_percent
            hydro_electric_percent
            natural_gas_percent
            nuclear_percent
            petro_liquids_percent
            wind_percent
            year
          }
        }
      }
    }
    allTargetGenerationJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          total_gen_by_wind
          perc_solar_target
          perc_wind_target
          wind_capacity_factor
          solar_capacity_factor
          target_wind_mw
          target_solar_mw
          current_wind_mw
          current_solar_mw
          capacityByYear {
            year
            wind_mw
            solar_mw
          }
        }
      }
    }
  }
`
