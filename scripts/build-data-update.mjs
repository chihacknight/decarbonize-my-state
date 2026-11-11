// Builds a frozen snapshot for the data updates page (src/pages/data-updates.js)
// comparing the site's key stats at BASE_REF ("before", default `main`) against
// the working tree ("after"). Run it on the data update branch before merging,
// since after the merge `main` already has the new data:
//
//   node scripts/build-data-update.mjs
//
// To rebuild it later, set BASE_REF to the commit before the merge. Emissions and power also get a
// "same source" value: the new data for the old year, which splits each change
// into a source effect and a real change.
//
// Stats are calculated the same way as src/components/state-details.js.

import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const BASE_REF = process.env.BASE_REF || "main"
const OUT_PATH = "src/data/data-updates/2020-2025.json"

const FILES = {
  emissions: "data/final/emissions/emissions.json",
  generation: "data/final/power_generation/power_generation.json",
  targets: "data/final/target_generation/target_generation.json",
  vehicles: "data/final/vehicles/vehicles.json",
  buildings: "data/final/buildings/buildings.json",
}

// Power stats whose old and new source differ by more than this, for the same
// year, get flagged and show all three values. Others show two.
const POWER_SOURCE_TOLERANCE = { carbonFreePct: 0, generationPct: 2 }

// Weights for the composite score, emissions change vs carbon-free change
const EMISSIONS_WEIGHT = 0.6
const POWER_WEIGHT = 0.4

const SECTORS = [
  "dirty_power",
  "buildings",
  "transportation",
  "dumps_farms_industrial_other",
]
const FUELS = [
  "coal",
  "natural_gas",
  "petro_liquids",
  "nuclear",
  "hydro_electric",
  "all_solar",
  "wind",
]
const CLEAN_FUELS = ["nuclear", "hydro_electric", "all_solar", "wind"]

/** Load a final JSON file from the base ref or the working tree, keyed by state */
function load(path, fromBase) {
  const text = fromBase
    ? execFileSync("git", ["show", `${BASE_REF}:${path}`], {
        cwd: ROOT,
        maxBuffer: 64 * 1024 * 1024,
      }).toString()
    : readFileSync(join(ROOT, path), "utf8")
  return Object.fromEntries(JSON.parse(text).map(row => [row.state, row]))
}

const before = {}
const after = {}
for (const [key, path] of Object.entries(FILES)) {
  before[key] = load(path, true)
  after[key] = load(path, false)
}

const round = (num, digits = 1) =>
  num === null || num === undefined || Number.isNaN(num)
    ? null
    : Math.round(num * 10 ** digits) / 10 ** digits

const diff = (a, b) => (a === null || b === null ? null : round(b - a))
const pctChange = (a, b) =>
  a === null || b === null || a === 0 ? null : round(((b - a) / a) * 100)

// #### EMISSIONS ####

const latestYear = rows => Math.max(...rows.map(r => r.year))

function emissionsFor(byState, state, year) {
  const row = byState[state]?.emissionsByYear.find(r => r.year === year)
  if (!row) return null
  const total = SECTORS.reduce((acc, s) => acc + row[s], 0)
  return {
    year,
    total: round(total),
    // Shares are kept unrounded-ish so the pp deltas don't pick up rounding noise
    shares: Object.fromEntries(
      SECTORS.map(s => [s, round((row[s] / total) * 100)])
    ),
    // Raw sector values for SingleBarChart
    chart: Object.fromEntries([
      ["year", year],
      ...SECTORS.map(s => [s, row[s]]),
    ]),
  }
}

const emissionsYearBefore = latestYear(
  Object.values(before.emissions)[0].emissionsByYear
)
const emissionsYearAfter = latestYear(
  Object.values(after.emissions)[0].emissionsByYear
)

// #### POWER ####

/**
 * The site's carbon-free % is the sum of the rounded per-fuel percents, so we
 * use the same to match what visitors see
 */
const carbonFree = row =>
  row ? CLEAN_FUELS.reduce((acc, f) => acc + row[`${f}_percent`], 0) : null

const totalTwh = row =>
  row ? round(FUELS.reduce((acc, f) => acc + row[f], 0) / 1000) : null

/** Build a generation row with percents from GWh, same rounding as the pipeline */
function generationRowFromGwh(year, gwh) {
  const total = FUELS.reduce((acc, f) => acc + gwh[f], 0)
  const row = { year }
  for (const f of FUELS) {
    row[f] = round(gwh[f])
    row[`${f}_percent`] = Math.round((gwh[f] / total) * 100)
  }
  return row
}

function generationFor(byState, state, year) {
  if (state === "united_states") {
    // No US row in the generation data, so sum the states
    const gwh = Object.fromEntries(FUELS.map(f => [f, 0]))
    for (const s of Object.values(byState)) {
      const row = s.generation.find(r => r.year === year)
      if (row) FUELS.forEach(f => (gwh[f] += row[f]))
    }
    return generationRowFromGwh(year, gwh)
  }
  return byState[state]?.generation.find(r => r.year === year) || null
}

const generationYearBefore = latestYear(
  Object.values(before.generation)[0].generation
)
const generationYearAfter = latestYear(
  Object.values(after.generation)[0].generation
)

// #### WIND & SOLAR BUILT ####

function windSolarBuilt(byState, state, fixedFormula) {
  let row = byState[state]
  if (state === "united_states") {
    const sum = key =>
      Object.values(byState).reduce((acc, r) => acc + (r[key] || 0), 0)
    row = {
      perc_solar_target:
        (sum("current_solar") / sum("total_gen_by_solar")) * 100,
      perc_wind_target: (sum("current_wind") / sum("total_gen_by_wind")) * 100,
    }
  }
  if (!row) return null
  // main had a precedence bug, `solar + wind / 2`, which is what the site showed
  return round(
    fixedFormula
      ? (row.perc_solar_target + row.perc_wind_target) / 2
      : row.perc_solar_target + row.perc_wind_target / 2
  )
}

// #### VEHICLES ####

function evPct(byState, state) {
  const row = byState[state]
  if (!row) return null
  return Math.round((row.EV_Registration / row.Cars_All) * 100 * 10) / 10
}

// #### BUILDINGS ####

function fossilFreeBefore(byState, state) {
  // main has 0/0 for AK, HI and the US, which the site treats as no data
  const hasData = r =>
    r && (r.weightedEleBuildingsPct !== 0 || r.weightedFossilBuildingsPct !== 0)
  if (state === "united_states") {
    const rows = Object.values(byState).filter(
      r => r.state !== "united_states" && hasData(r)
    )
    const total = rows.reduce((acc, r) => acc + r.buildings, 0)
    return round(
      rows.reduce(
        (acc, r) => acc + r.buildings * r.weightedEleBuildingsPct,
        0
      ) / total
    )
  }
  const row = byState[state]
  return hasData(row) ? round(row.weightedEleBuildingsPct) : null
}

function fossilFreeAfter(byState, state) {
  if (state === "united_states") {
    const rows = Object.values(byState)
    const total = rows.reduce((acc, r) => acc + r.homes, 0)
    return round(
      rows.reduce((acc, r) => acc + r.homes * r.fossilFreeHeatingPct, 0) / total
    )
  }
  const row = byState[state]
  return row ? round(row.fossilFreeHeatingPct) : null
}

// #### BUILD EACH PLACE ####

function threeWay(beforeVal, sameVal, afterVal, change) {
  return {
    before: beforeVal,
    same: sameVal,
    after: afterVal,
    sourceEffect: change(beforeVal, sameVal),
    realChange: change(sameVal, afterVal),
    total: change(beforeVal, afterVal),
  }
}

function buildPlace(state) {
  const eBefore = emissionsFor(before.emissions, state, emissionsYearBefore)
  const eSame = emissionsFor(after.emissions, state, emissionsYearBefore)
  const eAfter = emissionsFor(after.emissions, state, emissionsYearAfter)

  const gBefore = generationFor(before.generation, state, generationYearBefore)
  const gSame = generationFor(after.generation, state, generationYearBefore)
  const gAfter = generationFor(after.generation, state, generationYearAfter)

  const shareChange = (a, b) =>
    Object.fromEntries(SECTORS.map(s => [s, diff(a.shares[s], b.shares[s])]))

  const twoWay = (b, a) => ({ before: b, after: a, total: diff(b, a) })

  return {
    state,
    emissions: {
      ...threeWay(eBefore.total, eSame.total, eAfter.total, pctChange),
      shares: {
        before: eBefore.shares,
        same: eSame.shares,
        after: eAfter.shares,
        sourceEffect: shareChange(eBefore, eSame),
        realChange: shareChange(eSame, eAfter),
      },
      charts: { before: eBefore.chart, same: eSame.chart, after: eAfter.chart },
    },
    // Sum of the seven fuels, the same denominator as the carbon-free share
    generationTwh: threeWay(
      totalTwh(gBefore),
      totalTwh(gSame),
      totalTwh(gAfter),
      pctChange
    ),
    carbonFree: {
      ...threeWay(
        carbonFree(gBefore),
        carbonFree(gSame),
        carbonFree(gAfter),
        diff
      ),
      // Per-fuel percent change, new source only
      mixChange: Object.fromEntries(
        FUELS.map(f => [
          f,
          gSame && gAfter
            ? gAfter[`${f}_percent`] - gSame[`${f}_percent`]
            : null,
        ])
      ),
      charts: { before: gBefore, after: gAfter },
    },
    windSolarBuilt: twoWay(
      windSolarBuilt(before.targets, state, false),
      windSolarBuilt(after.targets, state, true)
    ),
    evPct: twoWay(evPct(before.vehicles, state), evPct(after.vehicles, state)),
    fossilFreeHomes: twoWay(
      fossilFreeBefore(before.buildings, state),
      fossilFreeAfter(after.buildings, state)
    ),
  }
}

/** Whether the old and new power data disagree for the same year */
const powerSourcesDiffer = place =>
  Math.abs(place.carbonFree.sourceEffect) >
    POWER_SOURCE_TOLERANCE.carbonFreePct ||
  Math.abs(place.generationTwh.sourceEffect) >=
    POWER_SOURCE_TOLERANCE.generationPct

const states = Object.keys(after.generation).sort()
const places = states.map(buildPlace)
const us = buildPlace("united_states")
// The full series for the site's emissions chart, new source only
us.emissionsByYear = after.emissions.united_states.emissionsByYear
for (const place of [...places, us]) {
  place.powerSourcesDiffer = powerSourcesDiffer(place)
}

// #### SCORES ####

/**
 * Percentile rank from 0 (worst) to 1 (best), averaging ties. `better` returns
 * true when a is better than b.
 */
function percentileRanks(values, higherIsBetter) {
  const n = values.length
  return values.map(v => {
    const worse = values.filter(o => (higherIsBetter ? o < v : o > v)).length
    const ties = values.filter(o => o === v).length - 1
    return (worse + ties / 2) / (n - 1)
  })
}

// DC is a city, so it's shown but not ranked
const ranked = places.filter(p => p.state !== "district_of_columbia")
const emissionsRanks = percentileRanks(
  ranked.map(p => p.emissions.realChange),
  false
)
const powerRanks = percentileRanks(
  ranked.map(p => p.carbonFree.realChange),
  true
)
ranked.forEach((p, i) => {
  p.score = round(
    EMISSIONS_WEIGHT * emissionsRanks[i] + POWER_WEIGHT * powerRanks[i],
    2
  )
})
;[...ranked]
  .sort((a, b) => b.score - a.score)
  .forEach((p, i) => (p.rank = i + 1))

// #### SUMMARY COUNTS ####

const countDirection = (key, higherIsBetter) => {
  const vals = ranked.map(p => p[key].realChange)
  const better = vals.filter(v => (higherIsBetter ? v > 0 : v < 0)).length
  const worse = vals.filter(v => (higherIsBetter ? v < 0 : v > 0)).length
  return { better, worse, same: vals.length - better - worse }
}

const output = {
  generatedAt: new Date().toISOString(),
  baseRef: BASE_REF,
  branch: execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
    cwd: ROOT,
  })
    .toString()
    .trim(),
  years: {
    emissions: { before: emissionsYearBefore, after: emissionsYearAfter },
    generation: { before: generationYearBefore, after: generationYearAfter },
  },
  weights: { emissions: EMISSIONS_WEIGHT, power: POWER_WEIGHT },
  rankedCount: ranked.length,
  powerFlagged: places.filter(p => p.powerSourcesDiffer).map(p => p.state),
  counts: {
    emissions: countDirection("emissions", false),
    carbonFree: countDirection("carbonFree", true),
  },
  us,
  places,
}

// Format with the repo's Prettier config, since `yarn test` checks src JSON
const prettier = createRequire(import.meta.url)("prettier")
const outFile = join(ROOT, OUT_PATH)
writeFileSync(
  outFile,
  prettier.format(JSON.stringify(output), {
    ...prettier.resolveConfig.sync(outFile),
    parser: "json",
  })
)

const top = [...ranked].sort((a, b) => a.rank - b.rank)
console.log(`Wrote ${OUT_PATH} (${places.length} places)`)
console.log(
  "Top 5:",
  top
    .slice(0, 5)
    .map(p => `${p.state} ${p.score}`)
    .join(", ")
)
console.log(
  "Bottom 5:",
  top
    .slice(-5)
    .map(p => `${p.state} ${p.score}`)
    .join(", ")
)
