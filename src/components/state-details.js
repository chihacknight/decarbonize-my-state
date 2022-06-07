import React, { useState } from "react"
import { graphql } from "gatsby"
import Scrollspy from "react-scrollspy"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css"
import SingleBarChart from "../components/singlebar"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SimpleAreaChart from "../components/simpleareachart"
import AlreadyElectrifiedChart from "./AlreadyElectrifiedChart"
import DisplayPlants from "./displayplants.js"
import WindSolarBuilds from "./WindSolarBuilds.js"

// image resources
import GasAppliances from "../images/gas-appliances.png"
import ElectricAppliances from "../images/electric-appliances.png"
import CarTransition from "../images/car-transition.png"
import CoalTransition from "../images/coal-plant-transition.png"
import OilPlantImg from "../images/oil-plant.png"
import GasPlantImg from "../images/gas-plant.png"
import CoalPlantImg from "../images/coal-plant.png"
import PowerPlantMap from "../images/dirty-power-plants.jpg"
import DirtyBuilding from "../images/dirty-building.png"
import CleanBuilding from "../images/clean-building.png"
import HeatPumpAndStove from "../images/electric-heat-pump-stove.png"
import GasBoilerAndStove from "../images/gas-boiler-stove.png"
import DirtyBus from "../images/dirty-bus.png"
import ElectricBus from "../images/electric-bus.png"
import SolarPanel from "../images/solar-panel.png"
import PowerPlant from "../images/power-plant.png"

const slugToTitle = (placeName) => {
  const words = placeName.split("_")

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word === "of") {
      words[i] = word
    } else {
      words[i] = word.charAt(0).toUpperCase() + word.slice(1)
    }
  }

  return words.join(" ")
}

/**
 * Converts a very large number to a more readable string.
 *
 * 2_114_602 -> '2.1 million'
 * 76_125 -> '76 thousand'
 */
function numberToHumanString (num) {
  // If in the thousands, return '{rounded_num} thousands', e.g.76_126 ->
  // 76 thousand
  if (num > 1_000 && num < 1_000_000) {
    return `${Math.round(num / 1_000)},000`
  }
  // If in the millions return '${rounded_num_one_decimal} millions', e.g.
  // 2_114_602 -> 2.1 million
  else if (num > 1_000_000 && num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(1)} million`
  }

  // If in the hundreds or something else, return as is (e.g 534)
  return num
}

const currentYear = new Date().getFullYear()
// We want to get to 0 by 2050 and we use our current emissions as a start,
// so the % to cut by is 100 divided by the number of years we have
const cutPerYearPrcnt = (100 / (2050 - currentYear)).toFixed(1)

export default function StateDetailsPage ({ location, data }) {
  /**
   * Properties to pass to the main desktop graph, which updates as you scroll
   */
  const [scrollGraphSettings, setScrollGraphSettings] = useState({
    active: "buildings",
    green: [],
  })

  // place info and string
  const currentPlace = location.pathname.split("/")[1]
  // clean up title as needed
  const placeTitle = slugToTitle(currentPlace)
  const stateFaceClass = currentPlace.toLowerCase().replaceAll(" ", "-")

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

  const rawEmissionsCutPerYear = (
    sumOfEmissions *
    (1 / (2050 - currentYear))
  ).toFixed(1)

  // #### VEHICLES ####
  const {
    Cars_All: carsAll,
    EV_Registration: evRegistration,
  } = data.allVehiclesJson.edges[0].node
  const pctEv = Math.round((evRegistration / carsAll) * 100 * 10) / 10
  const pctNonEv = Math.round((100 - pctEv) * 10) / 10
  // string formatting
  const carsCountStr =
    carsAll !== undefined ? numberToHumanString(carsAll) : "?"
  const carsPerYear =
    carsAll !== undefined
      ? numberToHumanString(Math.ceil((carsAll * cutPerYearPrcnt) / 100))
      : "?"
  const evCountStr =
    evRegistration !== undefined ? numberToHumanString(evRegistration) : "?"

  // #### BUILDINGS ####
  const {
    buildings,
    weightedFossilBuildingsPct,
    weightedEleBuildingsPct,
  } = data.allBuildingsJson.edges[0].node

  // string formatting
  const buildingsCountStr =
    buildings !== undefined ? numberToHumanString(buildings) : "?"
  const buildingsPerYear =
    buildings !== undefined
      ? numberToHumanString(Math.ceil((buildings * cutPerYearPrcnt) / 100))
      : "?"

  // #### SOLAR PANELS & WIND TURBINES ####
  const targetBuilds = data.allTargetGenerationJson.edges[0].node

  // deconstruct object for simplicity
  const {
    total_gen_by_solar: targetGenBySolar,
    total_gen_by_wind: targetGenByWind,
    current_solar: currentSolar,
    current_wind: currentWind,
    perc_solar_target: percSolarTarget,
    perc_wind_target: percWindTarget
  } = targetBuilds
  
  // since we are referencing capacity, let's stay consistent and make sure
  // everything is listed in MegaWatts... all of these numbers are in GigaWatts Hours
  const everyDayPerYear = 24 * 365
  const targetGenBySolarMW = (targetGenBySolar / everyDayPerYear) * 1000
  const targetGenByWindMW = (targetGenByWind / everyDayPerYear) * 1000
  const currentSolarMW = (currentSolar / everyDayPerYear) * 1000
  const currentWindMW = (currentWind / everyDayPerYear) * 1000

  const solarPanelsBuildPerYear = Math.round((targetGenBySolarMW - currentSolarMW)/30)
  const windTurbinesBuildPerYear = Math.round((targetGenByWindMW - currentWindMW)/30)

  // getting %s for chart
  const percSolarRemaining = 100 - percSolarTarget
  const percWindRemaining = 100 - percWindTarget

  // converting values to strings
  const solarPanelsCountStr = targetGenBySolarMW !== undefined
    ? numberToHumanString(targetGenBySolarMW)
    : '?'
  const windTurbinesCountStr = targetGenByWindMW !== undefined
    ? numberToHumanString(targetGenByWindMW)
    : '?'
  const solarPanelsBuildPerYearStr = targetGenBySolarMW !== undefined
    ? numberToHumanString(solarPanelsBuildPerYear)
    : '?'
  const windTurbinesBuildPerYearStr = targetGenByWindMW !== undefined
    ? numberToHumanString(windTurbinesBuildPerYear)
    : '?'

  // #### POWER PLANTS ####
  const powerPlants = data.allPowerPlantsJson.edges[0].node.power_plants

  powerPlants.sort((a, b) => b.capacity_mw - a.capacity_mw)

  const coalPlants = powerPlants.filter(
    (plant) => plant.fossil_fuel_category === "COAL"
  )
  const gasPlants = powerPlants.filter(
    (plant) => plant.fossil_fuel_category === "GAS"
  )
  const oilPlants = powerPlants.filter(
    (plant) => plant.fossil_fuel_category === "OIL"
  )

  function scrollTargetUpdated (scrollTarget) {
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

    if (targetId === "bld-main") {
      activeKey = "buildings"
      greenKeys = []
    } else if (targetId === "bld-end") {
      activeKey = ""
      greenKeys = ["buildings"]
    } else if (targetId === "trnsprt-main") {
      activeKey = "transportation"
      greenKeys = ["buildings"]
    } else if (targetId === "trnsprt-end") {
      activeKey = ""
      greenKeys = ["buildings", "transportation"]
    } else if (targetId === "power-main") {
      activeKey = "dirty_power"
      greenKeys = ["buildings", "transportation"]
    } else if (targetId === "power-end") {
      activeKey = ""
      greenKeys = ["buildings", "transportation", "dirty_power"]
    } else if (targetId === "other-main") {
      activeKey = "dumps_farms_industrial_other"
      greenKeys = ["buildings", "transportation", "dirty_power"]
    }

    setScrollGraphSettings({ active: activeKey, green: greenKeys })
  }
  // Description will retain formatting, so this needs to be single line
  const descriptionText = `To get to zero by 2050, ${placeTitle} must cut climate pollution by ${cutPerYearPrcnt}% a year. Electrification can help us get there.`

  return (
    <Layout>
      <SEO
        title={`What does it take to decarbonize ${placeTitle}?`}
        description={descriptionText}
      />

      <div className="sticky-header d-flex align-items-center">
        <h1 id="main" className="d-flex align-items-center mr-4 mb-0">
          <span
            className={"display-3 mr-4 sf-" + stateFaceClass}
            aria-hidden="true"
          ></span>
          <span className="title font-weight-bold h4 mb-0">{placeTitle}</span>
        </h1>

        <a className="btn btn-outline-secondary ml-3" href="/">
          Back <span className="d-none d-md-inline">to map</span>
        </a>
      </div>

      {/* Intro Section */}
      <div className="col-12">
        <p className="h1 font-weight-light mt-6 mb-5">
          To get to <strong className="font-weight-bold">zero</strong> by 2050,{" "}
          {placeTitle} must cut climate pollution by <strong className="font-weight-bold">{cutPerYearPrcnt}% a year.
          </strong>
        </p>

        <SimpleAreaChart emissions_data={emissionsByYear} />

        <p className="h1 font-weight-bold text-center mt-5">
          This is how we're going to do it.
        </p>

        <hr className="mt-7 mb-7" />
      </div>

      <div className="row state-details-main">
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
        </div>

        {/*
         * Right column on desktop, full width on mobile. This is a scroll spy
         * container to update the left graph
         */}
        <Scrollspy
          offset={-300}
          scrolledPastClassName={"scrolled-past"}
          items={[
            "bld-main",
            "bld-end",
            "trnsprt-main",
            "trnsprt-end",
            "power-main",
            "power-end",
            "other-main",
          ]}
          currentClassName="is-current"
          onUpdate={scrollTargetUpdated}
          className="col-12 col-xl-7"
        >
          {/* Buildings Section */}
          <div id="bld-main" className="scrollable-sect mt-5">
            <h2 className="h3 font-weight-bold mb-6">🏠 Buildings</h2>

              {/* Make SingleBarChart full width on mobile */}

            <div className="row mt-5">
              <div className="col-12 col-md-6 d-block d-xl-none mb-6">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  activeKey={"buildings"}
                />
              </div>
              <div className="col h3">

              <p className="h3 mt-2 mb-4">
                <strong className="font-weight-bold">{buildingsPrcnt}%</strong> of {placeTitle}'s pollution comes from buildings.
              </p>

                <p className="mt-5 mb-0">
                  <img
                    className="img-fluid"
                    src={DirtyBuilding}
                    alt="Building polluting by burning natural gas"
                  />
                </p>

              </div>
            </div>

            <p className="h3 mt-6 mb-0">
              {/* Sourced from Rewiring America Electrify Everything in Your Home guide */}
              Mostly from heating our air, water, and food.
            </p>

            <p className="mt-5 mb-0">
              <img
                className="img-fluid"
                src={GasBoilerAndStove}
                alt="Gas boiler, gas stove"
              />
            </p>

            <p className="h3 mt-6">
              To <strong>cut this pollution</strong>, replace your space and water heaters with{" "}
              <a
                href="https://en.wikipedia.org/wiki/Heat_pump"
                target="_blank"
                rel="noreferrer"
              >
                electric heat pumps
              </a>
              , and cook with{" "}
              <a
                href="https://en.wikipedia.org/wiki/Induction_cooking"
                target="_blank"
                rel="noreferrer"
              >
                induction stoves
              </a>{" "}
              instead of gas.
            </p>

            <p className="mt-5 mb-0">
              <img
                className="img-fluid"
                src={HeatPumpAndStove}
                alt="Electric heat pump, induction stove"
              />
            </p>

            <p className="h3 mt-6">
              Then, we'll electify <strong>all {buildingsCountStr} buildings</strong> in{" "}
              {placeTitle} — around {buildingsPerYear} a year.
            </p>

            {(weightedEleBuildingsPct !== 0 ||
              weightedFossilBuildingsPct !== 0) && (
              <p className="h3 mt-5">
                {Math.round(weightedEleBuildingsPct)}% of buildings are already free from fossil fuels!
              </p>
            )}
            <AlreadyElectrifiedChart
              label={"Buildings"}
              electrifiedPct={weightedEleBuildingsPct}
              fossilPct={weightedFossilBuildingsPct}
            />
          </div>

          <div id="bld-end" className="scrollable-sect mt-8 mb-7">
            <p className="h3 font-weight-bold text-center">
              That'll solve {buildingsPrcnt}% of the problem.
            </p>

            <div className="mt-5 d-flex justify-content-center d-block d-xl-none">
              <SingleBarChart
                emissionsData={latestEmissions}
                greenKeys={["buildings"]}
              />
            </div>

            <div className="action-panel">
              <h3 className="h4 font-weight-bold">What should I do?</h3>

              {/* TODO: Make these link somewhere */}
              <ul className="mt-3 pl-4 mb-0">
                <li>
                  <a href="http://example.com">
                    First, electrify your building(s)
                  </a>
                </li>
                <li>
                  <a href="http://example.com">
                    Then push your local politicians to electrify the rest
                  </a>
                </li>
              </ul>
            </div>

            <hr className="mt-7" />
          </div>

          {/* Transportation Section */}
          <div id="trnsprt-main" className="scrollable-sect">
            <h2 className="h3 font-weight-bold mb-6">🚗 Transport</h2>


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

                <p className="h3 mt-2">
                  <strong className="font-weight-bold">{transportPrcnt}%</strong> of {placeTitle}'s 
                  pollution comes from cars, trucks, boats and planes. But <strong>mostly from cars</strong>.
                </p>

                <p className="mt-5 mb-0">
                  <img
                    className="img-fluid"
                    src={DirtyBus}
                    alt="Dirty vehicle"
                  />
                </p>

              </div>
            </div>
              <p className="h3 mt-6">
                To cut this pollution, your next car needs to be electric.
              </p>

              <p className="mt-5 mb-0">
                <img
                  className="img-fluid"
                  src={ElectricBus}
                  alt="Electric vehicle"
                />
              </p>

              <p className="h3 mt-6">
                Then, we'll electrify all <strong>{carsCountStr} vehicles</strong> in{" "}
                {placeTitle} — around {carsPerYear} a year.
              </p>
              <p className="h3 mt-6">
                {pctEv}% of vehicles are already electric!
              </p>
              <AlreadyElectrifiedChart
                label={"Vehicles"}
                electrifiedPct={pctEv}
                fossilPct={pctNonEv}
              />
          </div>

          <div id="trnsprt-end" className="scrollable-sect mt-8 mb-7">
            <p className="h3 font-weight-bold text-center">
              That'll solve another {transportPrcnt}% of the problem.
            </p>

            <div className="mt-5 d-flex justify-content-center d-block d-xl-none">
              <SingleBarChart
                emissionsData={latestEmissions}
                greenKeys={["buildings", "transportation"]}
              />
            </div>

            <div className="action-panel">
              <h3 className="h4 font-weight-bold">What should I do?</h3>

              {/* TODO: Make these link somewhere */}
              <ul className="mt-3 pl-4 mb-0">
                <li>
                  <a href="http://example.com">If you have a car, buy an EV</a>
                </li>
                <li>
                  <a href="http://example.com">
                    Then push your local politicians to electrify the rest
                  </a>
                </li>
              </ul>
            </div>

            <hr className="mt-7" />
          </div>

          {/* Power Section */}
          {/* Show normal intro section if power emissions > 0 */}
          {powerPrcnt > 0 && (
            <div id="power-main" className="scrollable-sect mt-5">
              <h2 className="h3 font-weight-bold mb-6">🔌 Power</h2>


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

                <p className="h3 mt-2 mb-4">
                  <strong className="font-weight-bold">{powerPrcnt}%</strong> of {placeTitle}'s 
                  pollution comes from burning <strong>coal</strong>, <strong>gas</strong>, and <strong>oil</strong> to
                  make power.
                </p>
                <p className="mt-5 mb-0">
                  <img
                    className="img-fluid"
                    src={PowerPlant}
                    alt="Power plant"
                  />
                </p>

                </div>
              </div>

              <p className="h3 mt-5">
                To <strong>cut this pollution</strong>, put solar panels on your roof.
              </p>

              <p className="mt-5 mb-0">
                <img
                  className="img-fluid"
                  src={SolarPanel}
                  alt="Solar panel"
                />
              </p>

              <p className="h3 mt-5">
                Then, we'll replace the following power plants with solar and wind farms:
              </p>

              <p className="mt-5 mb-0">
                <img
                  className="img-fluid"
                  src={CoalTransition}
                  title="We need to replace dirty power plants with
                clean ones (mostly wind and solar)"
                  alt="We need to replace dirty power plants with
                clean ones (mostly wind and solar)"
                />
              </p>

              {coalPlants.length > 0 && (
                <>
                  <p className="h3 mt-5">
                    <strong className="font-weight-bold">
                      {coalPlants.length} coal plant
                      {coalPlants.length !== 1 && "s"}{" "}
                    </strong>
                  </p>
                  <DisplayPlants
                    plants={coalPlants}
                    plantImage={CoalPlantImg}
                  />
                </>
              )}

              {gasPlants.length > 0 && (
                <>
                  <p className="h3 mt-5">
                    <strong className="font-weight-bold">
                      {gasPlants.length} gas plant
                      {gasPlants.length !== 1 && "s"}
                    </strong>
                  </p>
                  <DisplayPlants plants={gasPlants} plantImage={GasPlantImg} />
                </>
              )}

              {oilPlants.length > 0 && (
                <>
                  <p className="h3 mt-5">
                    <strong className="font-weight-bold">
                      {oilPlants.length} oil plant
                      {oilPlants.length !== 1 && "s"}
                    </strong>
                  </p>
                  <DisplayPlants plants={oilPlants} plantImage={OilPlantImg} />
                </>
              )}

              <div className="card">
                <div className="card-body">
                  <a href="https://bit.ly/dirty-power-plants-usa" target="_blank" rel="noreferrer">
                    <p className="h5" style={{display: 'block'}}>See a map of dirty power plants in the US</p>
                    <img
                      className="img-fluid"
                      src={PowerPlantMap}
                      alt=""
                    />
                  </a>
                </div>
              </div>

              <p className="h3 mt-5">
                ...and help those workers find good jobs.
              </p>


              <p className="h3 mt-5">
                But it's not enough to swap our power plants for wind and solar farms.
              </p>

              <p className="h3 mt-5">
                We also need to make a <strong>lot</strong> more clean electricity
                to power all the cars and buildings we electrified earlier! 
              </p>

              <p className="h3 mt-5">
                How much more? <strong>2x</strong> what we make today!
              </p>

              <p className="h3 mt-5">
                So: to cut the pollution from our power, transport, and buildings, 
                we need actually need to build <strong className="font-weight-bold">{windTurbinesCountStr} MWs</strong> of wind 
                and <strong className="font-weight-bold">{solarPanelsCountStr} MWs</strong> of solar.
              </p>
              
              <p className="h3 mt-5">
                That's <strong className="font-weight-bold">{windTurbinesBuildPerYearStr} MWs</strong> of wind capacity 
                AND <strong className="font-weight-bold">{solarPanelsBuildPerYearStr} MWs</strong> of solar capacity a year.
              </p>

              <p className="h4 mt-5 text-muted">
                <WindSolarBuilds
                  label={'Solar'} percentCurrent={percSolarTarget} percentRemaining={percSolarRemaining}/>
              </p>

              <p className="h4 mt-5 text-muted">
                <WindSolarBuilds
                  label={'Wind'} percentCurrent={percWindTarget} percentRemaining={percWindRemaining}/>
              </p>
            </div>
          )}
          {/* Show standard outro section if power emissions are zero */}
          {powerPrcnt > 0 && (
            <div id="power-end" className="scrollable-sect mt-8 mb-7">
              <p className="h3 font-weight-bold text-center">
                That'll solve another {powerPrcnt}% of the problem.
              </p>

              <div className="mt-5 d-flex justify-content-center d-block d-xl-none">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  greenKeys={["buildings", "transportation", "dirty_power"]}
                />
              </div>

              <div className="action-panel">
                <h3 className="h4 font-weight-bold">What should I do?</h3>

                {/* TODO: Make these link somewhere */}
                <ul className="mt-3 pl-4 mb-0">
                  <li>
                    <a href="http://example.com">
                      Install solar panels and a battery in your building
                    </a>
                  </li>
                  <li>
                    <a href="http://example.com">
                      Support the construction of grid-scale wind and solar
                    </a>
                  </li>
                </ul>
              </div>

              <hr className="mt-7" />
            </div>
          )}

          {/* Show special section if power emissions are zero */}
          {powerPrcnt === "0" && (
            <div id="power-main" className="scrollable-sect mt-5 mb-7">
              <h2 className="h3 font-weight-bold">🔌 Power Generation</h2>
              <div className="mt-6 mb-8 text-center">
                <p className="h3 font-weight-bold">
                  {placeTitle} has absolutely no emissions from making power,
                  it's doing great! 😎
                </p>

                <p className="h5 mt-3">
                  Check out another state to see how they can cut their power
                  emissions to zero.
                </p>

                <hr className="mt-7" />
              </div>
            </div>
          )}

          {/* Other Section */}
          <div id="other-main" className="scrollable-sect mt-5">
            <h2 className="h3 font-weight-bold">🏭 Other Emissions</h2>

            <p className="h3 mt-5">
              The last{" "}
              <strong className="font-weight-bold">{otherPrcnt}%</strong> of
              emissions in {placeTitle} comes from other sources...
            </p>

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
                <p className="h3 mt-5">
                  This includes industry, landfills, and farming.
                </p>

                <p className="mt-3">
                  There's no one solution to solve these problems, but there are
                  a lot of great ideas!
                </p>

                <p>These include:</p>

                <ul>
                  <li>Regenerative agriculture to sequester carbon in soil</li>
                  <li>Composting to reduce landfill methane emissions</li>
                  <li>
                    New techniques for manufacturing CO<sub>2</sub> emitting
                    materials, like concrete
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Scrollspy>
      </div>

      <hr className="mt-7" />

      <section className="text-center mb-8">
        <div className="h1 mt-7 font-weight-bold">And that's it! 🎉</div>

        <p className="h4 mt-4">
          We hope this gives you some ideas for what you{" "}
          <br className="d-none d-lg-block" />
          can do to get your state to zero emissions!
        </p>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query StateQuery($state: String) {
    allBuildingsJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          buildings
          weightedFossilBuildingsPct
          weightedEleBuildingsPct
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
        }
      }
    }
    allPowerPlantsJson(filter: { state: { eq: $state } }) {
      edges {
        node {
          power_plants {
            plant_name
            fossil_fuel_category
            county
            capacity_mw
            utility_name
          }
        }
      }
    }
    allTargetGenerationJson(filter: {state: {eq: $state}}) {
      edges {
        node {
            total_gen_by_solar
            total_gen_by_wind
            current_wind
            current_solar
            perc_solar_target
            perc_wind_target
        }
      }
    }
  }
`
