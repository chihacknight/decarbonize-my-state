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
    allOccupationsJson {
      nodes {
        occupation
        occupation_slug
        green_job
        alabama
        alaska
        arizona
        arkansas
        california
        colorado
        connecticut
        delaware
        district_of_columbia
        florida
        georgia
        guam
        hawaii
        idaho
        illinois
        indiana
        iowa
        kansas
        kentucky
        louisiana
        maine
        maryland
        massachusetts
        michigan
        minnesota
        mississippi
        missouri
        montana
        nebraska
        nevada
        new_hampshire
        new_jersey
        new_mexico
        new_york
        north_carolina
        north_dakota
        ohio
        oklahoma
        oregon
        pennsylvania
        puerto_rico
        rhode_island
        south_carolina
        south_dakota
        tennessee
        texas
        utah
        vermont
        virgin_islands
        virginia
        washington
        west_virginia
        wisconsin
        wyoming
        alabama_concentration
        alaska_concentration
        arizona_concentration
        arkansas_concentration
        california_concentration
        colorado_concentration
        connecticut_concentration
        delaware_concentration
        district_of_columbia_concentration
        florida_concentration
        georgia_concentration
        guam_concentration
        hawaii_concentration
        idaho_concentration
        illinois_concentration
        indiana_concentration
        iowa_concentration
        kansas_concentration
        kentucky_concentration
        louisiana_concentration
        maine_concentration
        maryland_concentration
        massachusetts_concentration
        michigan_concentration
        minnesota_concentration
        mississippi_concentration
        missouri_concentration
        montana_concentration
        nebraska_concentration
        nevada_concentration
        new_hampshire_concentration
        new_jersey_concentration
        new_mexico_concentration
        new_york_concentration
        north_carolina_concentration
        north_dakota_concentration
        ohio_concentration
        oklahoma_concentration
        oregon_concentration
        pennsylvania_concentration
        puerto_rico_concentration
        rhode_island_concentration
        south_carolina_concentration
        south_dakota_concentration
        tennessee_concentration
        texas_concentration
        utah_concentration
        vermont_concentration
        virgin_islands_concentration
        virginia_concentration
        washington_concentration
        west_virginia_concentration
        wisconsin_concentration
        wyoming_concentration
      }
    } totalsJson {
      alabama
      alaska
      arizona
      arkansas
      california
      colorado
      connecticut
      delaware
      district_of_columbia
      florida
      georgia
      guam
      hawaii
      idaho
      illinois
      indiana
      iowa
      kansas
      kentucky
      louisiana
      maine
      maryland
      massachusetts
      michigan
      minnesota
      mississippi
      missouri
      montana
      nebraska
      nevada
      new_hampshire
      new_jersey
      new_mexico
      new_york
      north_carolina
      north_dakota
      ohio
      oklahoma
      oregon
      pennsylvania
      puerto_rico
      rhode_island
      south_carolina
      south_dakota
      tennessee
      texas
      utah
      vermont
      virgin_islands
      virginia
      washington
      west_virginia
      wisconsin
      wyoming
    }
  }
`
