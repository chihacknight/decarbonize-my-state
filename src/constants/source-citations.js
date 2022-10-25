import React from "react"

export function getShortCitation(slug) {
  const citation = getCitation(slug)
  return `${citation.source_short}, ${citation.date}`
}

export function getLongCitation(slug) {
  const citation = getCitation(slug)

  return (
    <p>
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
    title: "Climate Watch - U.S. States Greenhouse Gas Emissions 1990 to 2018",
    source: "World Resource Institute",
    source_short: "WRI",
    date: "Mar 2021",
    link:
      "https://datasets.wri.org/dataset/climate-watch-states-greenhouse-gas-emissions",
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
    title: "Electric generation by source 2001-2021",
    source: "U.S. Energy Information Administration (EIA)",
    source_short: "EIA",
    date: "Apr 2022",
    link: "https://www.eia.gov/opendata/v1/qb.php?category=1",
  },
]
