import React from "react"

import { getShortCitation } from "../constants/source-citations"

/** Below this share either way, a state counts as using about what it makes */
const MinTradePct = 2

/** From this share up, a state is a large importer or exporter, below it small */
const LargeTradePct = 15

/**
 * How much electricity a state imports or exports, shown under its power
 * generation pie chart, as a small or large importer or exporter. An
 * importer's power emissions leave out the plants making its imported power,
 * and an exporter's include plants making power used elsewhere, so this says
 * which way, and how much, that skews them.
 *
 * @param trade      The state's row from trade.json (see data/scripts/get_trade.py)
 * @param placeTitle The state's name
 */
export default function PowerTradeNote({ trade, placeTitle }) {
  const {
    year,
    netImports,
    interstateNetImports,
    internationalNetImports,
    netImportsPct,
    netExportsPct,
  } = trade

  // Alaska and Hawaii's grids don't connect to other states
  if (netImports === 0 && interstateNetImports === 0) {
    return (
      <div className="power-trade">
        <div className="power-trade-text">
          {placeTitle} doesn't trade electricity with other states, so its power
          emissions match the electricity it uses.
        </div>
        <Source year={year} />
      </div>
    )
  }

  const isImporter = netImportsPct >= MinTradePct
  const isExporter = netExportsPct >= MinTradePct

  if (!isImporter && !isExporter) {
    return (
      <div className="power-trade">
        <div className="power-trade-text">
          {placeTitle} generates about as much electricity as it uses, so its
          power emissions closely reflect the electricity it uses.
        </div>
        <Source year={year} />
      </div>
    )
  }

  // Where traded power comes from or goes to: other states, other countries
  // (Canada or Mexico) or both, by which way each kind of trade goes
  const sameWay = value => (isImporter ? value > 0 : value < 0)
  const viaStates = sameWay(interstateNetImports)
  const viaCountries = sameWay(internationalNetImports)
  const where =
    viaStates && viaCountries
      ? "other states or countries"
      : viaCountries
      ? "other countries"
      : "other states"

  const tradedPct = isImporter ? netImportsPct : netExportsPct
  const isLarge = tradedPct >= LargeTradePct
  const size = isLarge ? "large" : "small"

  // Rounded once, so the two shares always add up to 100%
  const tradedRounded = Math.round(tradedPct)
  const homePct = 100 - tradedRounded

  /**
   * What trade means for the state's power emissions and carbon-free share,
   * which only count its own power plants. Imports carry their own plants'
   * emissions, so an importer's are higher, but we don't know their mix, so its
   * carbon-free share could go either way. Exports are assumed to have the
   * state's own mix, so an exporter's emissions are lower and its share stays
   * about the same
   */
  const getNote = () => {
    if (isImporter && isLarge) {
      return `Power plants outside ${placeTitle} aren't counted above, so the emissions from the electricity it uses are likely higher than shown, and its carbon-free share could be higher or lower depending on where its imported power comes from.`
    }
    if (isImporter) {
      return `Power plants outside ${placeTitle} aren't counted in its power emissions above, so they're slightly lower than the pollution from the electricity it uses.`
    }
    if (isLarge) {
      return `Some of the power emissions above come from electricity used in ${where}, so the emissions from the electricity ${placeTitle} uses itself are lower than shown. Its carbon-free share stays about the same, assuming its exports have the same mix as its generation.`
    }
    return `${placeTitle}'s power emissions above include the plants making power for ${where}, so they're slightly higher than the pollution from the electricity it uses itself.`
  }
  const homeLabel = isImporter ? "Made in state" : "Used in state"
  const tradedLabel = isImporter ? "Imported" : "Exported"

  return (
    <div className="power-trade">
      <div className="power-trade-text">
        {isImporter ? (
          <>
            <strong>
              {isLarge && "Note that "}
              {placeTitle} is a {size} importer
            </strong>
            : about <strong>{tradedRounded}%</strong> of the electricity it uses
            comes from {where}.
          </>
        ) : (
          <>
            <strong>
              {isLarge && "Note that "}
              {placeTitle} is a {size} exporter
            </strong>
            : about <strong>{tradedRounded}%</strong> of the electricity it
            generates is used in {where}.
          </>
        )}
      </div>

      {/* Labels sit under the bar rather than in it, so small shares like
          Florida's 3% don't squeeze them */}
      <div
        className="power-trade-chart"
        role="img"
        aria-label={`${homePct}% ${homeLabel.toLowerCase()}, ${Math.round(
          tradedPct
        )}% ${tradedLabel.toLowerCase()}`}
      >
        <div className="power-trade-bar" aria-hidden="true">
          <span className="-home" style={{ flexGrow: 100 - tradedPct }} />
          <span className="-traded" style={{ flexGrow: tradedPct }} />
        </div>
        <div className="power-trade-labels" aria-hidden="true">
          <span>
            <span className="power-trade-swatch -home" />
            {homeLabel} <strong>{homePct}%</strong>
          </span>
          <span>
            <span className="power-trade-swatch -traded" />
            {tradedLabel} <strong>{tradedRounded}%</strong>
          </span>
        </div>
      </div>

      <div className="power-trade-note">{getNote()}</div>
      <Source year={year} />
    </div>
  )
}

const Source = ({ year }) => (
  <div className="power-trade-source text-secondary">
    Data as of {year}. Source: {getShortCitation("power-trade")}
  </div>
)
