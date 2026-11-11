import React from "react"

import { getShortCitation } from "../constants/source-citations"

/** Below this share either way, a state counts as using about what it makes */
const MinTradePct = 2

/**
 * How much electricity a state imports or exports, shown under its power
 * generation pie chart. A net importer's power emissions leave out the plants
 * making its imported power, and a net exporter's include plants making power
 * used elsewhere, so this says which way that skews them.
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
      ? "other states and countries"
      : viaCountries
      ? "other countries"
      : "other states"

  const tradedPct = isImporter ? netImportsPct : netExportsPct

  return (
    <div className="power-trade">
      <div className="power-trade-text">
        {isImporter ? (
          <>
            {placeTitle} is a <strong>net importer</strong>: about{" "}
            <strong>{Math.round(tradedPct)}%</strong> of the electricity it uses
            comes from {where}.
          </>
        ) : (
          <>
            {placeTitle} is a <strong>net exporter</strong>: about{" "}
            <strong>{Math.round(tradedPct)}%</strong> of the electricity it
            generates is used in {where}.
          </>
        )}
      </div>

      <div
        className="power-trade-bar"
        role="img"
        aria-label={
          isImporter
            ? `${Math.round(
                100 - tradedPct
              )}% made in ${placeTitle}, ${Math.round(tradedPct)}% imported`
            : `${Math.round(
                100 - tradedPct
              )}% used in ${placeTitle}, ${Math.round(tradedPct)}% exported`
        }
      >
        <span className="-home" style={{ flexGrow: 100 - tradedPct }}>
          {isImporter ? "Made in state" : "Used in state"}
        </span>
        <span className="-traded" style={{ flexGrow: tradedPct }}>
          {isImporter ? "Imported" : "Exported"}
        </span>
      </div>

      <div className="power-trade-note">
        {isImporter
          ? `Power plants outside ${placeTitle} aren't counted in its power emissions above, so they're lower than the pollution from the electricity it uses.`
          : `${placeTitle}'s power emissions above include the plants making power for ${where}, so they're higher than the pollution from the electricity it uses itself.`}
      </div>
      <Source year={year} />
    </div>
  )
}

const Source = ({ year }) => (
  <div className="power-trade-source text-secondary">
    {year} data. Source: {getShortCitation("power-trade")}
  </div>
)
