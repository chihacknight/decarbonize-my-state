import React from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

export function getTerminologyLink(slug) {
  const t = getTerminology(slug)
  return (
    <a href={`/terminology#${slug}`} target="_blank" rel="noreferrer">
      {t.term}
    </a>
  )
}

/**
 * Return a term phrase with a ? icon that shows a tooltip explaining the term
 */
export function getTerminologyHover(slug) {
  const t = getTerminology(slug)
  if (!t) {
    return <span class="terminology">{slug}</span>
  }

  const renderTooltip = props => (
    <Tooltip id="button-tooltip" {...props}>
      {t.definition}
    </Tooltip>
  )

  return (
    <span>
      {t.term}&nbsp;
      <OverlayTrigger
        placement="top"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        {/* For screen readers, provide term as this button's label */}
        <sup
          tabindex="0"
          role="tooltip"
          aria-label={t.term + " - " + t.definition}
        >
          [?]
        </sup>
      </OverlayTrigger>
    </span>
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
    definition: `A chemical element that readily forms compounds with many other elements and is a constituent of organic compounds in all known living things.`,
  },
  {
    slug: "carbon-dioxide",
    term: "carbon dioxide (CO2)",
    definition: `A molecule consisting of one carbon atom and two oxygen atoms.  A product of combustion, respiration and other natural processes.  Also a greenhouse gas.`,
  },
  {
    slug: "clean-electrification",
    term: "clean electrification",
    definition: `The process of converting combustion engines, heating and cooking appliances from fossil fuels (mainly gasoline and natural gas) to electric.`,
  },
  {
    slug: "decarbonize",
    term: "decarbonize",
    definition: `To move away from carbon producing appliances and machines.`,
  },
  {
    slug: "heat-pumps",
    term: "heat pumps",
    definition:
      "Heat pumps are electric appliances that can heat and cool a building using the refrigeration cycle, acting like reversible air conditioners.",
  },
  {
    slug: "induction-stoves",
    term: "electric induction stoves",
    definition:
      "Induction stoves are a type of electric stove that use magnets to create heat directly within pots or pans. These " +
      "are distinct from radiant electric stoves (which glow red) because they heat up and cool down immediately and don't stay hot after use!",
  },
  {
    slug: "geothermal-energy",
    term: "geothermal energy",
    definition: `The natural heat emanating from the Earth’s core being conveyed by either magma or water to the Earth’s surface where it can be converted to electricity or used for heating.`,
  },
  {
    slug: "ghg",
    term: "greenhouse gasses (GHG)",
    definition: `Any gaseous compounds (such as carbon dioxide or methane) that trap heat in the atmosphere and contributes to the greenhouse effect.`,
  },
  {
    slug: "greenhouse-effect",
    term: "greenhouse effect",
    definition: `The conversion of infrared light into heat.  Most noticed in closed automobiles on a sunny day.`,
  },
  {
    slug: "megawatt",
    term: "megawatt (MW)",
    definition: `A unit of electric power. A one megawatt power generator can power around 400-900 homes a year.`,
  },
  {
    slug: "mtco2e",
    term: "MTCO2e",
    definition: `Metric tons of carbon dioxide equivalent. "CO2e" represents an amount of  global warming potential that has been standardized to one unit of carbon dioxide (CO2).`,
  },
  {
    slug: "renewable-energy",
    term: "renewable energy",
    definition: `Electricity which is produced by either wind, solar or geothermal sources.`,
  },
]
