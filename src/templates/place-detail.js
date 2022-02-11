import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PlaceDetail from "../components/placedetail"
import get_2018_emissions from "../components/get_2018_emissions"

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
  "guam",
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
  "puerto_rico",
  "rhode_island",
  "south_carolina",
  "south_dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virgin_islands",
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
    allPlacesData[place]['emissions'] = data.finalJson[place]
  })
  return allPlacesData
}

const PlaceDetailPage = ({location, data}) => {
  const emissions_2018 = get_2018_emissions(data)
  return (
    <Layout>
      <SEO />
      <PlaceDetail location={location} placesData={getPlacesData(data)} emissions={emissions_2018}/>
    </Layout>
  )
}

export default PlaceDetailPage

export const query = graphql`
query PlaceQuery {
  finalJson {
    alabama {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    alaska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    arizona {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    arkansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    california {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    colorado {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    connecticut {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    delaware {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    district_of_columbia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    florida {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    georgia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    hawaii {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    idaho {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    illinois {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    indiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    iowa {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    kansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    kentucky {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    louisiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    maine {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    maryland {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    massachusetts {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    michigan {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    minnesota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    mississippi {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    missouri {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    montana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    nebraska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    nevada {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_hampshire {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_jersey {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_mexico {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    new_york {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    north_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    north_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    ohio {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    oklahoma {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    oregon {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    pennsylvania {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    rhode_island {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    south_carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    south_dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    tennessee {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    texas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    united_states {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    utah {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    vermont {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    washington {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    west_virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    wisconsin {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    wyoming {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
  }
}
`
