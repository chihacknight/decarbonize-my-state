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
    slug: "building-footprints",
    title: "U.S. Building Footprints",
    source: "Microsoft Maps",
    source_short: "Microsoft",
    date: "Mar 2021",
    link: "https://github.com/microsoft/USBuildingFootprints",
  },
  {
    slug: "building-energy",
    title: "U.S. Building Stock Characterization Study",
    source: "The National Renewable Energy Laboratory (NREL)",
    source_short: "NREL",
    date: "Dec 2021",
    link: "https://www.nrel.gov/docs/fy22osti/83063.pdf",
  },
  {
    slug: "vehicles",
    title: "State Motor-Vehicle Registrations",
    source: "U.S. Department of Transportation",
    source_short: "DOT",
    date: "Feb 2021",
    link: "https://www.fhwa.dot.gov/policyinformation/statistics/2017/mv1.cfm",
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
]
