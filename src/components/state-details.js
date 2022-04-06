import React from "react"
import { graphql } from "gatsby"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

import StackedBarChart from "../components/stackedbar"
import SingleBarChart from "../components/singlebar"
import Layout from "../components/layout"
import SEO from "../components/seo"
import SimpleAreaChart from "../components/simpleareachart"


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

const currentYear = new Date().getFullYear()
// We want to get to 0 by 2050 and we use our current emissions as a start,
// so the % to cut by is 100 divided by the number of years we have
const cutPerYearPrcnt = (100 / (2050 - currentYear)).toFixed(1)

const StateDetailsPage = ({location, data}) => {
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
  } = data.allVehiclesJson.edges[0].node.buildings
  const carsCountStr = carsAll !== undefined 
    ? carsAll.toLocaleString('en') 
    : '?'
  const carsPerYear = carsAll !== undefined 
    ? Math.ceil(carsAll * cutPerYearPrcnt / 100).toLocaleString('en') 
    : '?'
  const evCountStr = evRegistration !== undefined 
    ? evRegistration.toLocaleString('en') 
    : '?'

  // #### BUILDINGS ####
  const buildings = data.allBuildingsJson.edges[0].node.buildings
  const buildingsCountStr = buildings !== undefined
    ? buildings.toLocaleString('en')
    : '?'
  const buildingsPerYear = buildings !== undefined
    ? Math.ceil(buildings * cutPerYearPrcnt / 100).toLocaleString('en')
    : '?'


  return (
    <Layout>
      <SEO />

      <a className="btn btn-outline-secondary mb-5" href="/">Back to map</a>

      <div className='col-12'>
        <h1 className='display-4 d-flex align-items-center mr-4 mb-3 font-weight-bold'>
          <span className={ 'display-2 mr-4 sf-' + stateFaceClass } aria-hidden="true"></span>
          { placeTitle }
        </h1>
      </div>

      {/* { !placeData.emissions } */}

      {/* Intro Section */}
      <div className='col-12'>
        <p className="h1 font-weight-light mt-6 mb-6">
          To get to <strong className="font-weight-bold">zero</strong> by 2050, {placeTitle}<br/>
          must cut climate pollution by <strong className="font-weight-bold">{cutPerYearPrcnt}% a year.</strong>
        </p>

        <h4>Metric tons of carbon dioxide equivalent (MTCO2e) emissions</h4>
        <SimpleAreaChart emissions_data={placeData.emissions}/>

        <p className="h4 font-weight-bold">Emissions in {placeTitle}</p>
        <p className="h6 text-muted">
          Metric tons of carbon dioxide equivalent (MTCO2e) emissions
        </p>
  
        <p className="h1 font-weight-bold text-center mt-5">We can do it. Here's how.</p>

        <hr className="mt-5"/>
      </div>

      {/* Buildings Section */}
      <div className='col-12'>
        <h2 className="h3 mt-5 font-weight-bold">Buildings</h2>

        <p className="h3 mt-5">
          <strong className="font-weight-bold">{buildingsPrcnt}%</strong> of
          emissions in {placeTitle} comes from buildings.
        </p>

        <div className="row mt-5">
          { /* Make SingleBarChart full width on mobile */ }
          <div className="col-12-med">
            <SingleBarChart
              emissionsData={latestEmissions}
              activeKey='buildings' />
          </div>

          <div className="col h3">
            <p className="mt-5">
              Mostly from heating them.
            </p>

            <p className="mt-5">
              ?% of the pollution of your typical home comes from heating your
              space, water, and food.
            </p>
          </div>
        </div>

        <p className="h3 mt-5">
          To stop this pollution, we need to electrify our furnaces, water boilers, and stoves.
        </p>

        <p className="h3 mt-5">
          And we need to do this for all {buildingsCountStr} buildings in {placeTitle} (That's around {buildingsPerYear} per year)
        </p>

        <p className="h3 mt-7 font-weight-bold text-center">
          That will solve {buildingsPrcnt}% of the problem.
        </p>

        <div className="mt-5 d-flex justify-content-center">
          <SingleBarChart
            emissionsData={latestEmissions}
            greenKeys={ [ 'buildings' ] } />
        </div>

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
      <div className='col-12 col-lg-8'>
          

        <hr className="mt-5"/>
      </div>

      {/* Transportation Section */}
      <div className='col-12'>
        <h2 className="h3 mt-5 font-weight-bold">Getting Around</h2>

        <p className="h3 mt-5">
          <strong className="font-weight-bold">{transportPrcnt}%</strong> of
          emissions in {placeTitle} comes from cars, trucks, and planes.
        </p>

        <div className="row mt-5">
          { /* Make SingleBarChart full width on mobile */ }
          <div className="col-12-med">
            <SingleBarChart
              emissionsData={latestEmissions}
              activeKey='transportation' />
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
              in {placeTitle} (That's around {carsPerYear} a year. 
              Excluding the {evCountStr} EVs already in {placeTitle})
            </p>
          </div>
        </div>

        <p className="h3 mt-7 font-weight-bold text-center">
          That will solve another {transportPrcnt}% of the problem.
        </p>

        <div className="mt-5 d-flex justify-content-center">
          <SingleBarChart
            emissionsData={latestEmissions}
            greenKeys={[ 'buildings', 'transportation' ]} />
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

        <hr className="mt-5"/>
      </div>

      {/* Power Section */}
      <div className='col-12'>
        <h2 className="h3 mt-5 font-weight-bold">Power Generation</h2>


        {
          // Show special section if power emissions are zero
          powerPrcnt === '0' &&
          <div className="mt-8 mb-8 text-center">
            <p className="h3 font-weight-bold">
              {placeTitle} has no emissions from making power,
              it's doing great! 😎
            </p>

            <p className="h5 mt-3">
              Check out another state to see how they can cut their power
              emissions to zero.
            </p>
          </div>
        }
        { powerPrcnt > 0 && <HowToCleanPowerSection
          latestEmissions={latestEmissions}
          placeTitle={placeTitle}
          powerPrcnt={powerPrcnt} /> }

        <hr className="mt-5"/>
      </div>

      {/* Other Section */}
      <div className='col-12'>
        <h2 className="h3 mt-5 font-weight-bold">Other Emissions</h2>

        <p className="h3 mt-5">
          The last <strong className="font-weight-bold">{otherPrcnt}%</strong> of
          emissions in {placeTitle} comes other sources
        </p>

        <div className="row mt-5">
          { /* Make SingleBarChart full width on mobile */ }
          <div className="col-12-med">
            <SingleBarChart
              emissionsData={latestEmissions}
              activeKey='dumps_farms_industrial_other' />
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

        <hr className="mt-5" />

        <section className="text-center mb-8">
          <div className="h1 mt-7 font-weight-bold">
            And that's it! 🎉
          </div>

          <p className="h4 mt-4">
           We hope this gives you some ideas for what you can do to get your state
           to zero emissions!
          </p>
        </section>
      </div>
    </Layout>
  )
}
export default StateDetailsPage

/**
 * The section for how to clean up a state's power grid
 */
function HowToCleanPowerSection ({
  latestEmissions,
  placeTitle,
  powerPrcnt,
}) {
  return (
    <div>
      <p className="h3 mt-5">
        <strong className="font-weight-bold">{powerPrcnt}%</strong> of
        emissions in {placeTitle} comes from making power.
      </p>

      <div className="row mt-5">
        { /* Make SingleBarChart full width on mobile */ }
        <div className="col-12-med">
          <SingleBarChart
            emissionsData={latestEmissions}
            activeKey='dirty_power' />
        </div>

        <div className="col">
          <p className="h3 mt-5">
            Specifically from coal and gas plants.
          </p>

          <p className="h3 mt-5">
            To cut this pollution, we need to replace dirty power plants with
            clean ones. (mostly wind and solar)
          </p>
        </div>
      </div>

      <p className="h3 mt-5">
        And we need to do this for all <strong className="font-weight-bold">? coal plants in {placeTitle}</strong>
      </p>

      <p className="h3 mt-5">
        ...and all <strong className="font-weight-bold">? gas plants</strong>.
      </p>

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
        So to cut the climate pollution from our power, cars, and buildings we need to BUILD ? wind and solar farms. <br/>
        (That's ? a year)
      </p>

      <p className="h4 mt-5 text-muted">
        [insert animated map here]
      </p>

      <p className="h3 mt-7 font-weight-bold text-center">
        That will solve another {powerPrcnt}% of the problem.
      </p>

      <div className="mt-5 d-flex justify-content-center">
        <SingleBarChart
          emissionsData={latestEmissions}
          greenKeys={[ 'buildings', 'transportation', 'dirty_power' ]} />
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
    </div>
  )
}

export const query = graphql`
query StateQuery($state: String) {
  allBuildingsJson(filter: {state: {eq: $state}}) {
    edges {
      node {
        buildings
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
        emissionsByYear {
          Cars_All
          EV_Registration
        }
      }
    }
  }
}

`