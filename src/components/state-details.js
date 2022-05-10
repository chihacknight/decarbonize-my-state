import React, { useState } from "react"
import { graphql } from "gatsby"
import Scrollspy from "react-scrollspy"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import SingleBarChart from "../components/singlebar"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SimpleAreaChart from "../components/simpleareachart"
import AlreadyElectrifiedChart from "./AlreadyElectrifiedChart"
import DisplayPlants from "./displayplants.js"

import OilPlantImg from "../images/oil-plant.png"
import GasPlantImg from "../images/gas-plant.png"
import CoalPlantImg from "../images/coal-plant.png"


const slugToTitle = (placeName) => {
  const words = placeName.split('_')

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    if (word === "of") {
      words[i] = word
    } else {
      words[i] = word.charAt(0).toUpperCase() + word.slice(1)
    }
  }

  return words.join(' ')
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
  const [scrollGraphSettings, setScrollGraphSettings] = useState({ active: 'buildings', green: [] })

  // place info and string
  const currentPlace = location.pathname.split("/")[1]
  // clean up title as needed
  const placeTitle = slugToTitle(currentPlace)
  const stateFaceClass = currentPlace.toLowerCase().replaceAll(' ', '-')

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
    transportation: transportionEmissions
  } = latestEmissions

  // sum, then make nice percentages
  const sumOfEmissions = buildingsEmissions + dirtyPowerEmissions + farmsDumpsOtherEmissions + transportionEmissions
  const buildingsPrcnt = (buildingsEmissions / sumOfEmissions * 100).toFixed(0)
  const powerPrcnt = (dirtyPowerEmissions / sumOfEmissions * 100).toFixed(0)
  const transportPrcnt = (transportionEmissions / sumOfEmissions * 100).toFixed(0)
  const otherPrcnt = (farmsDumpsOtherEmissions / sumOfEmissions * 100).toFixed(0)

  // #### VEHICLES #### 
  const {
    Cars_All: carsAll,
    EV_Registration: evRegistration,
  } = data.allVehiclesJson.edges[0].node
  const pctEv = Math.round((evRegistration / carsAll * 100) * 10) / 10
  const pctNonEv = Math.round((100 - pctEv) * 10) / 10
  // string formatting
  const carsCountStr = carsAll !== undefined
    ? numberToHumanString(carsAll)
    : '?'
  const carsPerYear = carsAll !== undefined
    ? numberToHumanString(Math.ceil(carsAll * cutPerYearPrcnt / 100))
    : '?'
  const evCountStr = evRegistration !== undefined
    ? numberToHumanString(evRegistration)
    : '?'

  // #### BUILDINGS ####
  const {
    buildings,
    weightedFossilBuildingsPct,
    weightedEleBuildingsPct
  } = data.allBuildingsJson.edges[0].node

  // string formatting
  const buildingsCountStr = buildings !== undefined
    ? numberToHumanString(buildings)
    : '?'
  const buildingsPerYear = buildings !== undefined
    ? numberToHumanString(Math.ceil(buildings * cutPerYearPrcnt / 100))
    : '?'

  // #### SOLAR PANELS & WIND TURBINES ####
  const solarPanelsBuild = data.targetGenerationJson.edges[0].node.solarPanelsBuild
  const windTurbinesBuild = data.targetGenerationJson.edges[0].node.windTurbinesBuild
  const solarPanelsBuildPerYear = Math.round(solarPanelsBuild/30)
  const windTurbinesBuildPerYear = Math.round(windTurbinesBuild/30)


  const solarPanelsCountStr = solarPanelsBuild !== undefined
  ? numberToHumanString(solarPanelsBuild)
  : '?'
  const windTurbinesCountStr = windTurbinesBuild !== undefined
  ? numberToHumanString(windTurbinesBuild)
  : '?'
  const solarPanelsBuildPerYearStr = solarPanelsBuildPerYear !== undefined
  ? numberToHumanString(solarPanelsBuildPerYear)
  : '?'
  const windTurbinesBuildPerYearStr = windTurbinesBuildPerYear !== undefined
  ? numberToHumanString(windTurbinesBuildPerYear)
  : '?'

  // #### POWER PLANTS ####
  const powerPlants = data.allPowerPlantsJson.edges[0].node.power_plants

  powerPlants.sort((a, b) => b.capacity_mw - a.capacity_mw)

  const coalPlants = powerPlants.filter(plant => plant.fossil_fuel_category === "COAL")
  const gasPlants = powerPlants.filter(plant => plant.fossil_fuel_category === "GAS")
  const oilPlants = powerPlants.filter(plant => plant.fossil_fuel_category === "OIL")

  function scrollTargetUpdated (scrollTarget) {
    let activeKey = 'buildings'
    let greenKeys = []

    // Make sure we don't try using the scrollTarget if it's null
    if (!scrollTarget) {
      return
    }

    const targetId = scrollTarget.id

    if (!targetId) {
      console.error('Scroll target had no ID! Element was:', scrollTarget)
      setScrollGraphSettings({ active: activeKey, green: greenKeys })
      return
    }

    if (targetId === 'bld-main') {
      activeKey = 'buildings'
      greenKeys = []
    }
    else if (targetId === 'bld-end') {
      activeKey = ''
      greenKeys = ['buildings']
    }
    else if (targetId === 'trnsprt-main') {
      activeKey = 'transportation'
      greenKeys = ['buildings']
    }
    else if (targetId === 'trnsprt-end') {
      activeKey = ''
      greenKeys = ['buildings', 'transportation']
    }
    else if (targetId === 'power-main') {
      activeKey = 'dirty_power'
      greenKeys = ['buildings', 'transportation']
    }
    else if (targetId === 'power-end') {
      activeKey = ''
      greenKeys = ['buildings', 'transportation', 'dirty_power']
    }
    else if (targetId === 'other-main') {
      activeKey = 'dumps_farms_industrial_other'
      greenKeys = ['buildings', 'transportation', 'dirty_power']
    }

    setScrollGraphSettings({ active: activeKey, green: greenKeys })
  }

  return (
    <Layout>
      <SEO />

      <a className="btn btn-outline-secondary mb-5" href="/">Back to map</a>

      <div className="col-12">
        <h1 className="display-4 d-flex align-items-center mr-4 mb-3 font-weight-bold">
          <span className={'display-2 mr-4 sf-' + stateFaceClass} aria-hidden="true"></span>
          {placeTitle}
        </h1>
      </div>

      {/* Intro Section */}
      <div className="col-12">
        <p className="h1 font-weight-light mt-6 mb-6">
          To get to <strong className="font-weight-bold">zero</strong> by 2050, {placeTitle}<br />
          must cut climate pollution by <strong className="font-weight-bold">{cutPerYearPrcnt}% a year.</strong>
        </p>

        <h2 className="h4 font-weight-bold">Emissions in {placeTitle}</h2>
        <p className="h6">
          Million metric tons of carbon dioxide equivalent (MMTCO2e) emissions
        </p>
        <SimpleAreaChart emissions_data={emissionsByYear} />

        <p className="h1 font-weight-bold text-center mt-5">We can do it. Here's how.</p>

        <hr className="mt-7 mb-7" />
      </div>

      <div className="row state-details-main">
        { /**
           * Our main chart for desktop ONLY (others are hidden) this chart
           * should update as you scroll
           */ }
        <div className="col-4 sticky-cont d-none d-xl-block">
          <div className="graph-title font-weight-bold mb-3">
            CO<sub>2</sub> Equivalent Emissions in {placeTitle} by Source
          </div>

          <SingleBarChart
            isSticky={true}
            emissionsData={latestEmissions}
            activeKey={scrollGraphSettings.active}
            greenKeys={scrollGraphSettings.green} />
        </div>

        {/*
          * Right column on desktop, full width on mobile. This is a scroll spy
          * container to update the left graph
          */}
        <Scrollspy
          offset={-300}
          scrolledPastClassName={'scrolled-past'}
          items={[
            'bld-main', 'bld-end',
            'trnsprt-main', 'trnsprt-end',
            'power-main', 'power-end',
            'other-main']}
          currentClassName="is-current"
          onUpdate={scrollTargetUpdated}


          className="col-12 col-xl-7">
          {/* Buildings Section */}
          <div id="bld-main" className="scrollable-sect mt-5">
            <h2 className="h3 font-weight-bold">🏠 Buildings</h2>

            <p className="h3 mt-5">
              <strong className="font-weight-bold">{buildingsPrcnt}%</strong> of
              emissions in {placeTitle} comes from buildings.
            </p>

            <div className="row mt-5">
              { /* Make SingleBarChart full width on mobile */}
              <div className="col-12 col-md-6 d-block d-xl-none">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  activeKey={'buildings'} />
              </div>

              <div className="col h3">
                <p className="mt-5">
                  Mostly from different types of heating.
                </p>

                <p className="mt-5 mb-0">
                  {/* Sourced from Rewiring America Electrify Everything in Your Home guide */}
                  80% of the pollution of your typical home comes from heating your
                  space, water, and food.
                </p>
              </div>
            </div>

            <p className="h3 mt-5">
              To stop this pollution, we need to electrify our furnaces, water
              boilers, and stoves.
            </p>

            <p className="h3 mt-5">
              And we need to do this for all {buildingsCountStr} buildings
              in {placeTitle}. That's around {buildingsPerYear} per year.
            </p>

            {(weightedEleBuildingsPct !== 0 || weightedFossilBuildingsPct !== 0) && (
              <p className="h3 mt-5">
                {Math.round(weightedEleBuildingsPct)}% of building systems' energy use in {placeTitle} are already electrified.
              </p>
            )}
            <AlreadyElectrifiedChart
              label={'Building Systems'} electrifiedPct={weightedEleBuildingsPct} fossilPct={weightedFossilBuildingsPct}
            />
          </div>

          <div id="bld-end" className="scrollable-sect mt-8 mb-7">
            <p className="h3 font-weight-bold text-center">
              That will solve {buildingsPrcnt}% of the problem.
            </p>

            <div className="mt-5 d-flex justify-content-center d-block d-xl-none">
              <SingleBarChart
                emissionsData={latestEmissions}
                greenKeys={['buildings']} />
            </div>

            <div className="action-panel">
              <h3 className="h4 font-weight-bold">What should I do?</h3>

              {/* TODO: Make these link somewhere */}
              <ul className="mt-3 pl-4 mb-0">
                <li>
                  <a href="http://example.com">First, electrify your building(s)</a>
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
            <h2 className="h3 font-weight-bold">
              🚗 Getting Around
            </h2>

            <p className="h3 mt-5">
              <strong className="font-weight-bold">{transportPrcnt}%</strong> of
              emissions in {placeTitle} comes from cars, trucks, and planes.
            </p>

            <div className="row mt-5">
              { /* Make SingleBarChart full width on mobile */}
              <div className="col-12 col-md-6 d-block d-xl-none">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  activeKey='transportation'
                  greenKeys={['buildings']} />
              </div>

              <div className="col h3">
                <p className="mt-5">
                  Mostly from our cars.
                </p>

                <p className="mt-5">
                  To cut this pollution, replace your car with an EV.
                </p>

                <p className="mt-5">
                  And we need to do this for all {carsCountStr} cars
                  in {placeTitle}. That's around {carsPerYear} a year.
                </p>
                <p className="mt-5">
                  {evCountStr} vehicles in {placeTitle} are already EVs ({pctEv}% of the total).
                </p>
                <AlreadyElectrifiedChart
                  label={'Vehicles'} electrifiedPct={pctEv} fossilPct={pctNonEv}
                />
              </div>
            </div>
          </div>

          <div id="trnsprt-end" className="scrollable-sect mt-8 mb-7">
            <p className="h3 font-weight-bold text-center">
              That will solve another {transportPrcnt}% of the problem.
            </p>

            <div className="mt-5 d-flex justify-content-center d-block d-xl-none">
              <SingleBarChart
                emissionsData={latestEmissions}
                greenKeys={['buildings', 'transportation']} />
            </div>

            <div className="action-panel">
              <h3 className="h4 font-weight-bold">What should I do?</h3>

              {/* TODO: Make these link somewhere */}
              <ul className="mt-3 pl-4 mb-0">
                <li>
                  <a href="http://example.com">
                    If you have a car, buy an EV
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

          {/* Power Section */}
          {/* Show normal intro section if power emissions > 0 */}
          {powerPrcnt > 0 &&
            <div id="power-main" className="scrollable-sect mt-5">
              <h2 className="h3 font-weight-bold">
                🔌 Power Generation
              </h2>

              <p className="h3 mt-5">
                <strong className="font-weight-bold">{powerPrcnt}%</strong> of
                emissions in {placeTitle} comes from making power.
              </p>

              <div className="row mt-5">
                { /* Make SingleBarChart full width on mobile */}
                <div className="col-12 col-md-6 d-block d-xl-none">
                  <SingleBarChart
                    emissionsData={latestEmissions}
                    activeKey='dirty_power'
                    greenKeys={['buildings', 'transportation']} />
                </div>

                <div className="col">
                  <p className="h3 mt-5">
                    Specifically from coal and gas plants.
                  </p>

                  <p className="h3 mt-5">
                    To cut this pollution, we need to replace dirty power plants with
                    clean ones(mostly wind and solar). And in {placeTitle} we need to do this for:
                  </p>
                </div>
              </div>
              <p className="h3 mt-5">
                {coalPlants.length > 2 && "all"}{coalPlants.length === 2 && "both"} <strong className="font-weight-bold">
                  {coalPlants.length} coal plant{(coalPlants.length !== 1) && "s"} </strong>
              </p>

              <DisplayPlants plants={coalPlants} plantImage={CoalPlantImg} />

              <p className="h3 mt-5">
                {/* ...and {gasPlants.length > 2 && "all"}{gasPlants.length === 2 && "both"}  */}
                <strong className="font-weight-bold">{gasPlants.length} gas plant{(gasPlants.length !== 1) && "s"}</strong>
              </p>
              <DisplayPlants plants={gasPlants} plantImage={GasPlantImg} />

              <p className="h3 mt-5">
                {/* ...and {oilPlants.length > 2 && "all"}{oilPlants.length === 2 && "both"}  */}
                <strong className="font-weight-bold">{oilPlants.length} oil plant{(oilPlants.length !== 1) && "s"}</strong>
              </p>
              <DisplayPlants plants={oilPlants} plantImage={OilPlantImg} />
            

              <p className="h3 mt-5">
                ...and help those workers find good jobs.
              </p>

              <p className="h3 mt-5">
                But wait! Remember how we electrified all cars and buildings?
              </p>

              <p className="h3 mt-5">
                Our machines don't pollute now, because they run on electricity!
              </p>

              <p className="h3 mt-5">
                But that means we need to make more power for those new electric
                machines - <strong className="font-weight-bold">twice</strong> as much power as we make now!
              </p>

              <p className="h3 mt-5">
                And <strong className="font-weight-bold">all of it needs to be clean power!</strong>
              </p>

              <p className="h3 mt-5">
                So to cut the climate pollution from our power, cars, and buildings we need to BUILD <strong className="font-weight-bold">{windTurbinesCountStr}</strong> wind and <strong className="font-weight-bold">{solarPanelsCountStr}</strong> solar farms. <br />
                That's <strong className="font-weight-bold">{windTurbinesBuildPerYearStr}</strong> turbines AND <strong className="font-weight-bold">{solarPanelsBuildPerYearStr}</strong> solar panels a year.
              </p>

              <p className="h4 mt-5 text-muted">
                [insert animated map here]
              </p>
            </div>}
          { /* Show standard outro section if power emissions are zero */}
          {powerPrcnt > 0 &&
            <div id="power-end" className="scrollable-sect mt-8 mb-7">
              <p className="h3 font-weight-bold text-center">
                That will solve another {powerPrcnt}% of the problem.
              </p>

              <div className="mt-5 d-flex justify-content-center d-block d-xl-none">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  greenKeys={['buildings', 'transportation', 'dirty_power']} />
              </div>

              <div className="action-panel">
                <h3 className="h4 font-weight-bold">What should I do?</h3>

                {/* TODO: Make these link somewhere */}
                <ul className="mt-3 pl-4 mb-0">
                  <li>
                    <a href="http://example.com">Install solar panels and a battery in your building</a>
                  </li>
                  <li>
                    <a href="http://example.com">
                      Support the construction of grid-scale wind and solar
                    </a>
                  </li>
                </ul>
              </div>

              <hr className="mt-7" />
            </div>}

          { /* Show special section if power emissions are zero */}
          {powerPrcnt === '0' &&
            <div id="power-main" className="scrollable-sect mt-5 mb-7">
              <h2 className="h3 font-weight-bold">
                🔌 Power Generation
              </h2>
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
            </div>}

          {/* Other Section */}
          <div id="other-main" className="scrollable-sect mt-5">
            <h2 className="h3 font-weight-bold">
              🏭 Other Emissions
            </h2>

            <p className="h3 mt-5">
              The last <strong className="font-weight-bold">{otherPrcnt}%</strong> of
              emissions in {placeTitle} comes other sources
            </p>

            <div className="row mt-5">
              { /* Make SingleBarChart full width on mobile */}
              <div className="col-12 col-md-6 d-block d-xl-none">
                <SingleBarChart
                  emissionsData={latestEmissions}
                  activeKey='dumps_farms_industrial_other'
                  greenKeys={['buildings', 'transportation', 'dirty_power']} />
              </div>

              <div className="col">
                <p className="h3 mt-5">
                  This includes industry, landfills, and farming.
                </p>

                <p className="mt-3">
                  There's no one solution to solve these problems, but there are a
                  lot of great ideas!
                </p>

                <p>
                  These include:
                </p>

                <ul>
                  <li>Regenerative agriculture to sequester carbon in soil</li>
                  <li>Composting to reduce landfill methane emissions</li>
                  <li>
                    New techniques for manufacturing
                    CO<sub>2</sub> emitting materials, like concrete
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Scrollspy>
      </div>

      <hr className="mt-7" />

      <section className="text-center mb-8">
        <div className="h1 mt-7 font-weight-bold">
          And that's it! 🎉
        </div>

        <p className="h4 mt-4">
          We hope this gives you some ideas for what you <br className="d-none d-lg-block" />
          can do to get your state to zero emissions!
        </p>
      </section>
    </Layout>
  )
}

export const query = graphql`
query StateQuery($state: String) {
  allBuildingsJson(filter: {state: {eq: $state}}) {
    edges {
      node {
        buildings
        weightedFossilBuildingsPct
        weightedEleBuildingsPct
      }
    }
  }
  allEmissionsJson(filter: {state: {eq: $state}}) {
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
  allVehiclesJson(filter: {state: {eq: $state}}) {
    edges {
      node {
        Cars_All
        EV_Registration
      }
    }
  }
  allPowerPlantsJson(filter: {state: {eq: $state}}) {
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
  targetGenerationJson(filter: {state: {eq: $state}}) {
    edges {
      node {
        target_solar_panels
        target_wind_turbines
      }
    }
  }
}

`