import React, { useMemo, useState } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import PowerPiesMap from "../components/power-pies-map"
import EmissionsBarsMap from "../components/emissions-bars-map"
import EvShareMap from "../components/ev-share-map"
import CleanHomesMap from "../components/clean-homes-map"
import { EmissionsCategories } from "../constants/emissions-categories"
import { getTrends } from "../components/trends"

const sourceKeys = [
  "all_solar",
  "wind",
  "nuclear",
  "hydro_electric",
  "coal",
  "natural_gas",
  "petro_liquids",
]

const cleanKeys = ["all_solar", "wind", "nuclear", "hydro_electric"]

/**
 * Each state's latest year of generation percentages, adding up the
 * carbon-free share the same way the state pages do so the numbers match.
 * There's no US total in the data, so the national share adds up every
 * state's generation
 */
const getGeneration = data => {
  const generationByState = {}
  let nationalCleanGwh = 0
  let nationalGwh = 0
  data.allPowerGenerationJson.edges.forEach(({ node }) => {
    const latest = [...node.generation].sort((a, b) => b.year - a.year)[0]
    if (!latest) {
      return
    }
    const generation = { year: latest.year }
    sourceKeys.forEach(key => {
      generation[key] = Math.max(0, latest[`${key}_percent`] || 0)
    })
    generation.carbonFree = cleanKeys.reduce(
      (acc, key) => acc + generation[key],
      0
    )
    generationByState[node.state] = generation

    // Net generation can dip below zero, so count those as zero like the
    // power mix chart
    sourceKeys.forEach(key => {
      const gwh = Math.max(0, latest[key] || 0)
      nationalGwh += gwh
      if (cleanKeys.includes(key)) {
        nationalCleanGwh += gwh
      }
    })
  })
  const nationalCarbonFreePct =
    nationalGwh > 0 ? Math.round((nationalCleanGwh / nationalGwh) * 100) : null
  return { generationByState, nationalCarbonFreePct }
}

/**
 * Each state's latest year of homes and the share heated without fossil
 * fuels, plus the national share from every state's homes added up
 */
const getCleanHomes = data => {
  const cleanHomesByState = {}
  let nationalCleanHomes = 0
  let nationalHomes = 0
  data.allBuildingsJson.edges.forEach(({ node }) => {
    const byYear = [...node.byYear].sort((a, b) => a.year - b.year)
    const latest = byYear[byYear.length - 1]
    if (!latest || node.state === "united_states") {
      return
    }
    const first = byYear[0]
    cleanHomesByState[node.state] = {
      year: latest.year,
      homes: latest.homes,
      cleanHomes: latest.fossilFreeHomes,
      pct: latest.fossilFreeHeatingPct,
      firstYear: first.year,
      firstPct: first.fossilFreeHeatingPct,
    }
    nationalCleanHomes += latest.fossilFreeHomes
    nationalHomes += latest.homes
  })
  const nationalPct =
    nationalHomes > 0
      ? Math.round((nationalCleanHomes / nationalHomes) * 1000) / 10
      : null
  return { cleanHomesByState, nationalPct }
}

const emissionsKeys = Object.values(EmissionsCategories).map(({ key }) => key)

/**
 * Each state's latest year of emissions, with each category's share rounded
 * the same way as the state pages
 */
const getEmissionsByState = data => {
  const emissionsByState = {}
  data.allEmissionsJson.edges.forEach(({ node }) => {
    const latest = [...node.emissionsByYear].sort((a, b) => b.year - a.year)[0]
    if (!latest || node.state === "united_states") {
      return
    }
    const total = emissionsKeys.reduce(
      (acc, key) => acc + Math.max(0, latest[key] || 0),
      0
    )
    if (total <= 0) {
      return
    }
    const shares = {}
    emissionsKeys.forEach(key => {
      shares[key] = Math.round((Math.max(0, latest[key] || 0) / total) * 100)
    })
    emissionsByState[node.state] = { year: latest.year, total, shares }
  })
  return emissionsByState
}

/** A share of cars that are electric, rounded like the state pages */
const getEvPct = (evs, cars) => Math.round((evs / cars) * 100 * 10) / 10

/**
 * Each state's latest year of cars and electric vehicles, plus the share for
 * the US as a whole
 */
const getEvShares = data => {
  const evShareByState = {}
  let nationalPct = null
  data.allVehiclesJson.edges.forEach(({ node }) => {
    const byYear = [...node.byYear].sort((a, b) => a.year - b.year)
    const latest = byYear[byYear.length - 1]
    if (!latest || !latest.Cars_All) {
      return
    }
    const pct = getEvPct(latest.EV_Registration, latest.Cars_All)
    if (node.state === "united_states") {
      nationalPct = pct
      return
    }
    const first = byYear[0]
    evShareByState[node.state] = {
      year: latest.year,
      cars: latest.Cars_All,
      evs: latest.EV_Registration,
      pct,
      firstYear: first.year,
      firstPct: first.Cars_All
        ? getEvPct(first.EV_Registration, first.Cars_All)
        : null,
    }
  })
  return { evShareByState, nationalPct }
}

/**
 * Adds a state's yearly values into national totals, as year to an array of
 * running sums, for data with no US row
 */
function addToNational(national, year, values) {
  if (!national[year]) {
    national[year] = values.map(() => 0)
  }
  values.forEach((value, i) => {
    national[year][i] += value
  })
}

/** National totals as [{year, value}], from a function of each year's sums */
const nationalToHistory = (national, toValue) =>
  Object.entries(national).map(([year, sums]) => ({
    year: Number(year),
    value: toValue(sums),
  }))

/**
 * Each map's trends (see trends.js). Windows are 5 years, except for slower
 * moving or noisier data:
 *
 * - Emissions use 10 years, since the data ends in 2022 and a shorter window
 *   would hinge on the 2020 COVID dip. They're fit as a percent change, since
 *   states' totals vary so much, and per category too for the bar filters
 * - Clean homes use 10 years, since they change slowly and come from a survey
 *   with a margin of error around 1 point. States above 85% are never called
 *   behind the trend, since they're nearly done
 */
const getAllTrends = data => {
  // Power: the carbon-free share from generation, like the national share
  const powerHistory = {}
  const powerNational = {}
  data.allPowerGenerationJson.edges.forEach(({ node }) => {
    powerHistory[node.state] = node.generation.map(row => {
      let clean = 0
      let total = 0
      sourceKeys.forEach(key => {
        const gwh = Math.max(0, row[key] || 0)
        total += gwh
        if (cleanKeys.includes(key)) {
          clean += gwh
        }
      })
      addToNational(powerNational, row.year, [clean, total])
      return { year: row.year, value: total > 0 ? (clean / total) * 100 : null }
    })
  })

  // Homes: the share heated without fossil fuels
  const homesHistory = {}
  const homesNational = {}
  data.allBuildingsJson.edges.forEach(({ node }) => {
    if (node.state === "united_states") {
      return
    }
    homesHistory[node.state] = node.byYear.map(row => {
      addToNational(homesNational, row.year, [row.fossilFreeHomes, row.homes])
      return { year: row.year, value: row.fossilFreeHeatingPct }
    })
  })

  // EVs: the share of cars, with a US row in the data
  const evHistory = {}
  let evNationalHistory = []
  data.allVehiclesJson.edges.forEach(({ node }) => {
    const history = node.byYear
      .filter(row => row.Cars_All)
      .map(row => ({
        year: row.year,
        value: (row.EV_Registration / row.Cars_All) * 100,
      }))
    if (node.state === "united_states") {
      evNationalHistory = history
    } else {
      evHistory[node.state] = history
    }
  })

  // Emissions: the total and each category, with a US row in the data
  const emissionsSeries = ["total", ...emissionsKeys]
  const emissionsHistory = {}
  const emissionsNational = {}
  emissionsSeries.forEach(series => {
    emissionsHistory[series] = {}
  })
  data.allEmissionsJson.edges.forEach(({ node }) => {
    emissionsSeries.forEach(series => {
      const history = node.emissionsByYear.map(row => ({
        year: row.year,
        value:
          series === "total"
            ? emissionsKeys.reduce((acc, key) => acc + (row[key] || 0), 0)
            : row[series],
      }))
      if (node.state === "united_states") {
        emissionsNational[series] = history
      } else {
        emissionsHistory[series][node.state] = history
      }
    })
  })

  const emissions = {}
  emissionsSeries.forEach(series => {
    emissions[series] = {
      ...getTrends({
        historyByState: emissionsHistory[series],
        nationalHistory: emissionsNational[series],
        years: 10,
        higherIsBetter: false,
        relative: true,
      }),
      unit: "%",
    }
  })

  return {
    emissions,
    power: {
      ...getTrends({
        historyByState: powerHistory,
        nationalHistory: nationalToHistory(
          powerNational,
          ([clean, total]) => (clean / total) * 100
        ),
        years: 5,
      }),
      unit: "pts",
    },
    homes: {
      ...getTrends({
        historyByState: homesHistory,
        nationalHistory: nationalToHistory(
          homesNational,
          ([clean, homes]) => (clean / homes) * 100
        ),
        years: 10,
        ceiling: 85,
      }),
      unit: "pts",
    },
    ev: {
      ...getTrends({
        historyByState: evHistory,
        nationalHistory: evNationalHistory,
        years: 5,
      }),
      unit: "pts",
    },
  }
}

/** Each map's toggle label, heading and intro */
const views = {
  emissions: {
    label: "Climate Pollution",
    title: "Climate Pollution by State",
    intro:
      "Where each state's climate pollution comes from. Pick a source to compare it across states, or a state to learn how it can decarbonize",
  },
  power: {
    label: "Carbon-Free Power",
    title: "Carbon-Free Power by State",
    intro:
      "How much of each state's power comes from carbon-free sources. Pick a state to learn how it can get to 100%",
  },
  homes: {
    label: "Clean Homes",
    title: "Clean Homes by State",
    intro:
      "The share of each state's homes heated without burning fossil fuels, mostly with electricity. Pick a state to learn how it can electrify the rest",
  },
  ev: {
    label: "Electric Vehicles",
    title: "Electric Vehicles by State",
    intro:
      "The share of each state's cars that are electric. Every state is still under 5%, so the colors stretch across that range to show the differences",
  },
}

const MapPage = ({ data }) => {
  const [view, setView] = useState("emissions")
  const { generationByState, nationalCarbonFreePct } = getGeneration(data)
  const cleanHomes = getCleanHomes(data)
  const emissionsByState = getEmissionsByState(data)
  const { evShareByState, nationalPct } = getEvShares(data)
  const allTrends = useMemo(() => getAllTrends(data), [data])
  const [showTrends, setShowTrends] = useState(true)
  // Sparklines show either way, the checkbox only hides the trend glyphs
  const withGlyphs = trends => trends && { ...trends, showGlyphs: showTrends }
  const trends = {
    power: withGlyphs(allTrends.power),
    homes: withGlyphs(allTrends.homes),
    ev: withGlyphs(allTrends.ev),
    emissions: {},
  }
  Object.entries(allTrends.emissions).forEach(([series, seriesTrends]) => {
    trends.emissions[series] = withGlyphs(seriesTrends)
  })

  return (
    <Layout>
      <SEO
        title="State Climate Map"
        description="Compare where each state's climate pollution comes from, and how much of its power is carbon-free."
      />
      <h1 id="main" className="text-center font-weight-bold mt-5">
        {views[view].title}
      </h1>
      <p className="h5 text-center font-weight-normal mt-3 mb-4">
        {views[view].intro}
      </p>

      <div className="overlay-map-view-toggle">
        <div className="chart-toggle" role="group" aria-label="Show a map of">
          {Object.entries(views).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              className={view === key ? "-active" : ""}
              aria-pressed={view === key}
              onClick={() => setView(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overlay-map-controls">
        <label>
          <input
            type="checkbox"
            checked={showTrends}
            onChange={event => setShowTrends(event.target.checked)}
          />
          Show trends
        </label>
      </div>

      {view === "emissions" && (
        <EmissionsBarsMap
          emissionsByState={emissionsByState}
          trendsBySeries={trends.emissions}
        />
      )}
      {view === "power" && (
        <PowerPiesMap
          generationByState={generationByState}
          nationalPct={nationalCarbonFreePct}
          trends={trends.power}
        />
      )}
      {view === "homes" && (
        <CleanHomesMap
          cleanHomesByState={cleanHomes.cleanHomesByState}
          nationalPct={cleanHomes.nationalPct}
          trends={trends.homes}
        />
      )}
      {view === "ev" && (
        <EvShareMap
          evShareByState={evShareByState}
          nationalPct={nationalPct}
          trends={trends.ev}
        />
      )}
    </Layout>
  )
}

export default MapPage

export const query = graphql`
  query StateMapsQuery {
    allBuildingsJson {
      edges {
        node {
          state
          byYear {
            year
            homes
            fossilFreeHomes
            fossilFreeHeatingPct
          }
        }
      }
    }
    allVehiclesJson {
      edges {
        node {
          state
          byYear {
            year
            Cars_All
            EV_Registration
          }
        }
      }
    }
    allEmissionsJson {
      edges {
        node {
          state
          emissionsByYear {
            year
            buildings
            dirty_power
            dumps_farms_industrial_other
            transportation
          }
        }
      }
    }
    allPowerGenerationJson {
      edges {
        node {
          state
          generation {
            year
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
          }
        }
      }
    }
  }
`
