import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PlaceDetail from "../components/placedetail"

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
    allPlacesData[place]['total'] = data.totalsJson[place]

    // populate ranks for each occupation
    allPlacesData[place]['ranks'] = []
    data.allOccupationsJson.nodes.forEach((occ, j) => {
      if (occ.green_job && occ[place + '_concentration']) {
        const occ_rank = {}
        occ_rank['occupation'] = occ.occupation
        occ_rank['occupation_slug'] = occ.occupation_slug
        occ_rank['total_employed'] = occ[place]
        occ_rank['concentration'] = occ[place + '_concentration']
        allPlacesData[place]['ranks'].push(occ_rank)
      }
    })
    // sort by total employed, descending
    allPlacesData[place]['ranks'].sort((a,b) => b.concentration-a.concentration)
    // set the rank in the object
    allPlacesData[place]['ranks'].forEach((occ, j) => {
      allPlacesData[place]['ranks'][j]['rank'] = j + 1
    })
  })
  return allPlacesData
}

const PlaceDetailPage = ({location, data}) => {

  return (
    <Layout>
      <SEO />
      <PlaceDetail location={location} placesData={getPlacesData(data)}/>
    </Layout>
  )
}

export default PlaceDetailPage

export const query = graphql`
query PlaceQuery {
  finalJson {
    Alabama {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Alaska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Arizona {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Arkansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    California {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Colorado {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Connecticut {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Delaware {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    District_Of_Columbia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Florida {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Georgia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Hawaii {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Idaho {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Illinois {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Indiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Iowa {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Kansas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Kentucky {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Louisiana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Maine {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Maryland {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Massachusetts {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Michigan {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Minnesota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Mississippi {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Missouri {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Montana {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Nebraska {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Nevada {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_Hampshire {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_Jersey {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_Mexico {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    New_York {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    North_Carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    North_Dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Ohio {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Oklahoma {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Oregon {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Pennsylvania {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Rhode_Island {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    South_Carolina {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    South_Dakota {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Tennessee {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Texas {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    United_States {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Utah {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Vermont {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Washington {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    West_Virginia {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Wisconsin {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
    Wyoming {
      year
      dirty_power
      buildings
      transportation
      dumps_farms_industrial
    }
  }
}
`
