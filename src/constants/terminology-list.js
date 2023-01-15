import React from "react"

export function getTerminologyLink(slug) {
  const t = getTerminology(slug)
  return (
    <a href={`/terminology#${slug}`} target="_blank">
      {t.term}
    </a>
  )
}

export function getTerminology(slug) {
  const t = terminologyDefs.filter(c => c.slug === slug)
  return t[0]
}

export const terminologyDefs = [
  {
    slug: "carbon",
    term: "carbon",
    definition: `A nonmetallic chemical element with atomic number 6 that readily
    forms compounds with many other elements and is a constituent of
    organic compounds in all known living tissues.`,
  },
  {
    slug: "carbon-dioxide",
    term: "carbon dioxide",
    definition: `A molecule consisting of one carbon atom and two oxygen atoms.  A product of combustion, respiration and other natural processes.  Also a greenhouse gas.`,
  },
  {
    slug: "decarbonize",
    term: "decarbonize",
    definition: `To move away from carbon producing appliances.`,
  },
  {
    slug: "electrification",
    term: "electrification",
    definition: `The process of converting combustion engines, heating and cooking appliances from fossil fuels (mainly gasoline and natural gas) to electric.`,
  },
  {
    slug: "geothermal-energy",
    term: "geothermal energy",
    definition: `The natural heat emanating from the Earth’s core being conveyed by either magma or water to the Earth’s surface where it can be converted to electricity or used to heat homes.`,
  },
  {
    slug: "ghg",
    term: "greenhouse gasses",
    definition: `Any of various gaseous compounds (such as carbon dioxide or ozone) that absorb infrared light, trapping  heat in the atmosphere, and contributes to the greenhouse effect`,
  },
  {
    slug: "greenhouse-effect",
    term: "greenhouse effect",
    definition: `The conversion of infrared light into heat.  Most noticed in closed automobiles on a sunny day.`,
  },
  {
    slug: "megawatt",
    term: "megawatt",
    definition: `A unit of energy. One megawatt can power 400-900 homes a year.`,
  },
  {
    slug: "mtco2e",
    term: "MTCO2e",
    definition: `Metric tons of carbon dioxide equivalent or MTCO2e is the unit of measurement in this tool. The unit "CO2e" represents an amount of a greenhouse gas whose atmospheric impact has been standardized to that of one unit mass of carbon dioxide (CO2), based on the global warming potential (GWP) of the gas in question.`,
  },
  {
    slug: "renewable-energy",
    term: "renewable energy",
    definition: `Electricity which is produced by either wind, solar or geothermal sources. As opposed to fossil fuels, which are non-renewable because they depend on oil, coal or other sources that take millions of years to be made. Solar, wind, and geothermal are thus relatively infinite.`,
  },
]
