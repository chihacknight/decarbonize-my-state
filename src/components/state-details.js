import React, { useState } from "react"
import { graphql } from "gatsby"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

import StackedBarChart from "../components/stackedbar"
import SingleBarChart from "../components/singlebar"
import Layout from "../components/layout"
import SEO from "../components/seo"

const places = [
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "district_of_columbia",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new_hampshire",
  "new_jersey",
  "new_mexico",
  "new_york",
  "north_carolina",
  "north_dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "rhode_island",
  "south_carolina",
  "south_dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "west_virginia",
  "wisconsin",
  "wyoming"
]

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

const getPlacesData = (data) => {
  const allPlacesData = {}
  places.forEach((place, i) => {
    const placeTitle = slugToTitle(place)
    allPlacesData[place] = {}
    allPlacesData[place]['name'] = placeTitle

    // grab the state total employed from totals
    allPlacesData[place]['emissions'] = data[place]
  })
  return allPlacesData
}

const currentYear = new Date().getFullYear()

// We want to get to 0 by 2050 and we use our current emissions as a start,
// so the % to cut by is 100 divided by the number of years we have
const cutPerYearPrcnt = (100 / (2050 - currentYear)).toFixed(1)

const StateDetailsPage = ({location, data}) => {
  const currentPlace = location.pathname.split("/")[1]
  const placesData = getPlacesData(data.emissionsJson)

  const currPlaceData = placesData[currentPlace]

  let buildingsPrcnt, powerPrcnt, transportPrcnt

  // NOTE: We don't have emissions for all states (like Guam)
  const placeAllEmissions = currPlaceData.emissions

  let placeEmissions

  if (placeAllEmissions) {
    // Get the last year of emissions data we have to use for showing the
    // breakdown of how much emission comes from each source in this state
    placeEmissions = placeAllEmissions[placeAllEmissions.length - 1]

    const totalLatestEmissions = placeEmissions.buildings +
      placeEmissions.dirty_power +
      placeEmissions.dumps_farms_industrial_other +
      placeEmissions.transportation

    buildingsPrcnt = (placeEmissions.buildings / totalLatestEmissions * 100).toFixed(0)
    powerPrcnt = (placeEmissions.dirty_power / totalLatestEmissions * 100).toFixed(0)
    transportPrcnt = (placeEmissions.transportation / totalLatestEmissions * 100).toFixed(0)
  }

  const placeTitle = currPlaceData.name

  const [ placeData ] = useState(currPlaceData)

  const stateFaceClass = placeData.name.toLowerCase().replaceAll(' ', '-')

  return (
    <Layout>
      <SEO />

      <a className="btn btn-outline-secondary mb-5" href="/">Back to map</a>

      <div className='col-12'>
        <h1 className='display-4 d-flex align-items-center mr-4 mb-3 font-weight-bold'>
          <span className={ 'display-2 mr-4 sf-' + stateFaceClass } aria-hidden="true"></span>
          {placeData.name}
        </h1>
      </div>

      { !placeData.emissions }

      {/* Intro Section */}
      <div className='col-12'>
        <p className="h1 font-weight-light mt-6 mb-6">
          To get to <strong className="font-weight-bold">zero</strong> by 2050, {placeTitle}<br/>
          must cut climate pollution by <strong className="font-weight-bold">{cutPerYearPrcnt}% a year.</strong>
        </p>

        <p className="h4 font-weight-bold">Emissions in {placeTitle}</p>
        <p className="h6 text-muted">
          Metric tons of carbon dioxide equivalent (MTCO2e) emissions
        </p>
        <StackedBarChart emissions_data={placeData.emissions}/>

        <p className="h1 font-weight-bold text-center mt-5">We can do it. Here's how.</p>

        <hr className="mt-5"/>
      </div>

      {/* Buildings Section */}
      <div className='col-12'>
        <h2 className="h3 mt-5 font-weight-bold">Buildings</h2>

        <p className="h3 mt-5">
          <strong className="font-weight-bold">{buildingsPrcnt}%</strong> of emissions in {placeTitle} comes from buildings.
        </p>

        <div className="row mt-5">
          { /* Make SingleBarChart full width on mobile */ }
          <div className="col-12-med">
            <SingleBarChart
              emissionsData={placeEmissions}
              activeKey='buildings' />
          </div>

          <div className="col h3 mt-6">
            <p>
              Mostly from heating them.
            </p>

            <p className="mt-4">
              ?% of the pollution of your typical home comes from heating your
              space, water, and food.
            </p>
          </div>
        </div>

        <p className="h3 mt-5">
          To stop this pollution, we need to electrify our furnaces, water boilers, and stoves.
        </p>

        <p className="h3 mt-5">
          And we need to do this for all ? buildings in {placeTitle} (that's
          around ? per year)
        </p>

        <p className="h3 mt-7 font-weight-bold text-center">
          That will solve {buildingsPrcnt}% of the problem.
        </p>

        <div className="mt-5 d-flex justify-content-center">
          <SingleBarChart
            emissionsData={placeEmissions}
            greenKeys={ [ 'buildings' ] } />
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

        <hr className="mt-5"/>
      </div>

      {/* Transportation Section */}
      <div className='col-12'>
        <h2 className="h3 mt-5 font-weight-bold">Getting Around</h2>

        <p className="h3 mt-5">
          <strong className="font-weight-bold">{transportPrcnt}%</strong> of emissions in {placeTitle} comes from cars, trucks, and planes.
        </p>

        <div className="row mt-5">
          { /* Make SingleBarChart full width on mobile */ }
          <div className="col-12-med">
            <SingleBarChart
              emissionsData={placeEmissions}
              activeKey='transportation' />
          </div>

          <div className="col">
            <p>Mostly from our cars</p>

            <p className="h3 mt-5">
              To cut this pollution, replace your car with an EV.
            </p>

            <p className="h3 mt-5">
              And we need to do this for all ? cars in {placeTitle}
              (That's around ? a year.)
            </p>
          </div>
        </div>

        <p className="h3 mt-7 font-weight-bold text-center">
          That will solve another {transportPrcnt}% of the problem.
        </p>

        <div className="mt-5 d-flex justify-content-center">
          <SingleBarChart
            emissionsData={placeEmissions}
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

        <p className="h3 mt-5">
          <strong className="font-weight-bold">{powerPrcnt}%</strong> of emissions in {placeTitle} comes from making power.
        </p>

        <div className="row mt-5">
          { /* Make SingleBarChart full width on mobile */ }
          <div className="col-12-med">
            <SingleBarChart
              emissionsData={placeEmissions}
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
            emissionsData={placeEmissions}
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
    </Layout>
  )
}

export default StateDetailsPage

export const query = graphql`
query PlaceQuery {
  emissionsJson {
    alabama {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    alaska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    arizona {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    arkansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    california {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    colorado {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    connecticut {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    delaware {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    district_of_columbia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    florida {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    georgia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    hawaii {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    idaho {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    illinois {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    indiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    iowa {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    kansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    kentucky {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    louisiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    maine {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    maryland {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    massachusetts {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    michigan {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    minnesota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    mississippi {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    missouri {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    montana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    nebraska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    nevada {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_hampshire {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_jersey {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_mexico {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    new_york {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    north_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    north_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    ohio {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    oklahoma {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    oregon {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    pennsylvania {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    rhode_island {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    south_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    south_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    tennessee {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    texas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    united_states {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    utah {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    vermont {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    washington {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    west_virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    wisconsin {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
    wyoming {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial_other
    }
  }
}
`
