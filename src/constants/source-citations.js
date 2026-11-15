import React from "react"

export function getShortCitation(slug) {
  const citation = getCitation(slug)
  return (
    <a href={`/about#data-${slug}`} target="_blank" rel="noreferrer">
      {citation.source_short}, {citation.date}
    </a>
  )
}

export function getLongCitation(slug) {
  const citation = getCitation(slug)

  return (
    <p id={`data-${slug}`}>
      <a className="font-weight-bold" href={citation.link}>
        {citation.title}
      </a>
      <br />
      {citation.source}
      <br />
      {citation.date}
    </p>
  )
}

function getCitation(slug) {
  const citation = sourceCitations.filter(c => c.slug === slug)
  return citation[0]
}

const sourceCitations = [
  {
    slug: "emissions",
    title:
      "Inventory of U.S. Greenhouse Gas Emissions and Sinks by State 1990 to 2022",
    source: "U.S. Environmental Protection Agency",
    source_short: "EPA",
    date: "Aug 2024",
    link: "https://www.epa.gov/ghgemissions/state-ghg-emissions-and-removals",
  },
  {
    slug: "home-heating",
    title:
      "American Community Survey 1-Year Estimates: House Heating Fuel (B25040) 2005–2025",
    source: "U.S. Census Bureau",
    source_short: "Census American Community Survey",
    date: "Oct 2026",
    link: "https://data.census.gov/table/ACSDT1Y2025.B25040",
  },
  {
    slug: "vehicles",
    title:
      "Light-Duty Vehicle Registration Counts by State and Fuel Type 2016–2025",
    source: "U.S. Department of Energy, Alternative Fuels Data Center",
    source_short: "AFDC",
    date: "2025",
    link: "https://afdc.energy.gov/vehicle-registration",
  },
  {
    slug: "power-plants",
    title: "Environmental Justice Screening and Mapping Tool (EJScreen)",
    source: "U.S. Environmental Protection Agency (EPA)",
    source_short: "EPA",
    date: "Jan 2021",
    link:
      "https://www.epa.gov/airmarkets/power-plants-and-neighboring-communities#mapping",
  },
  {
    slug: "power-generation",
    title: "Electric generation by source 2001-2025",
    source: "U.S. Energy Information Administration (EIA)",
    source_short: "EIA",
    date: "Sep 2026",
    link: "https://www.eia.gov/opendata/bulkfiles.php",
  },
  {
    slug: "power-trade",
    title: "State Electricity Profiles, supply and disposition of electricity",
    source: "U.S. Energy Information Administration (EIA)",
    source_short: "EIA",
    date: "Nov 2025",
    link: "https://www.eia.gov/electricity/state/",
  },
]
