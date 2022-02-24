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
