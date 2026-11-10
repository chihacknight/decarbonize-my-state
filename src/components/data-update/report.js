import React, { useRef } from "react"

import { slugToTitle } from "../../helper-functions"
import SimpleAreaChart from "../simpleareachart"
import {
  SECTOR_LABELS,
  FUEL_LABELS,
  Chevron,
  Delta,
  EmissionsBars,
  PowerPies,
  ThreeWay,
  StatTile,
  ShareChips,
  fmt,
} from "./common"
import "./data-update.css"

const CLEAN_FUELS = ["nuclear", "hydro_electric", "all_solar", "wind"]

/** Captions for each of the before / same source / after values */
function getCaptions(years) {
  const e = years.emissions
  const g = years.generation
  return {
    years: { emissions: e.after, generation: g.after },
    emissions: {
      before: `Previous · WRI ${e.before}`,
      same: `EPA ${e.before}`,
      after: `Updated · EPA ${e.after}`,
    },
    generation: {
      before: `Previous · EIA ${g.before}`,
      same: `EIA ${g.before} (new file)`,
      after: `Updated · EIA ${g.after}`,
    },
    // Labels under the main comparison and the bracketed previous number
    emissionsLabels: {
      main: (
        <>
          EPA {e.before} <Chevron /> {e.after}
        </>
      ),
      previous: `WRI ${e.before}`,
    },
    generationLabels: {
      main: (
        <>
          EIA {g.before} <Chevron /> {g.after}
        </>
      ),
      previous: `EIA ${g.before}, old file`,
    },
  }
}

/** The stat lines shared by the US summary and each state card */
function Stats({
  place,
  captions,
  placeTitle,
  headingName,
  emissionsByYear,
  showBars = true,
}) {
  return (
    <>
      <ThreeWay
        label={`${headingName} Emissions`}
        stat={place.emissions}
        unit=" MMT CO₂e"
        changeUnit="%"
        higherIsBetter={false}
        labels={captions.emissionsLabels}
        showPrevious={true}
      />
      {/* The site doesn't show US bars, so the summary leaves them out */}
      {showBars && (
        <EmissionsBars
          charts={place.emissions.charts}
          captions={captions.emissions}
        />
      )}
      <ShareChips
        lead={
          <>
            real share change, {captions.emissions.same} <Chevron />{" "}
            {captions.years.emissions}
          </>
        }
        changes={place.emissions.shares.realChange}
        labels={SECTOR_LABELS}
        higherIsBetter={() => null}
      />
      {/* Only the US summary passes the full series */}
      {emissionsByYear && (
        <div className="state-graph-section emissions-trend">
          <SimpleAreaChart
            emissionsData={emissionsByYear}
            title={`Emissions in ${placeTitle}`}
            showProjection={false}
          />
        </div>
      )}

      {/* Most states' power data is the same in both sources, so those only
          show the new source's old and new year */}
      <ThreeWay
        label={`${headingName} Carbon-free power`}
        stat={place.carbonFree}
        unit="%"
        changeUnit="%"
        higherIsBetter={true}
        digits={0}
        labels={captions.generationLabels}
        showPrevious={place.powerSourcesDiffer}
      />
      <PowerPies
        charts={place.carbonFree.charts}
        captions={captions.generation}
        placeTitle={placeTitle}
      />
      <ShareChips
        changes={place.carbonFree.mixChange}
        labels={FUEL_LABELS}
        higherIsBetter={fuel => CLEAN_FUELS.includes(fuel)}
      />

      {/* Total generation is the carbon-free share's denominator, so growth
          in fossil generation can lower the share even as clean power grows */}
      <ThreeWay
        label={`${headingName} Generation`}
        stat={place.generationTwh}
        unit=" TWh"
        changeUnit="%"
        higherIsBetter={null}
        labels={captions.generationLabels}
        showPrevious={place.powerSourcesDiffer}
      />

      {/* These sources don't cover the old year, so there's no same-source
          value and the change includes the method change */}
      <div className="stat-tiles">
        <StatTile
          label={`${headingName} Wind & solar built`}
          stat={place.windSolarBuilt}
          unit="%"
          caption={
            <>
              EIA 2021 <Chevron /> 2025, formula fixed
            </>
          }
        />
        <StatTile
          label={`${headingName} EVs`}
          stat={place.evPct}
          unit="%"
          caption={
            <>
              AFDC 2020 cars <Chevron /> 2025 all light-duty
            </>
          }
        />
        <StatTile
          label={`${headingName} Fossil-free homes`}
          stat={place.fossilFreeHomes}
          unit="%"
          caption={
            <>
              NREL appliances <Chevron /> ACS 2024 heating
            </>
          }
        />
      </div>
    </>
  )
}

function StateCard({ place, captions, rankedCount }) {
  const title = slugToTitle(place.state)
  return (
    <section className="state-card" id={place.state}>
      <header>
        <h3>
          <span className={"sf-" + place.state}></span>
          {title}
        </h3>
        <div className="card-meta">
          <div className="rank">
            {place.rank ? (
              <>
                #{place.rank} <span className="muted">of {rankedCount}</span> ·{" "}
                {fmt(place.score, 2)}
              </>
            ) : (
              <span className="muted">not ranked</span>
            )}
          </div>
          <a className="back-to-top" href="#top" aria-label="Back to top">
            <Chevron />
          </a>
        </div>
      </header>
      <Stats
        place={place}
        captions={captions}
        placeTitle={title}
        headingName={title}
      />
    </section>
  )
}

/** Sticky, collapsible menu of every state, closed again after picking one */
function JumpNav({ places }) {
  const detailsRef = useRef(null)
  const close = () => {
    detailsRef.current.open = false
  }

  return (
    <details className="jump-nav" ref={detailsRef}>
      <summary>
        Jump to a state
        <Chevron />
      </summary>
      <nav>
        {places.map(p => (
          <a key={p.state} href={`#${p.state}`} onClick={close}>
            {slugToTitle(p.state)}
          </a>
        ))}
      </nav>
    </details>
  )
}

function RankList({ title, places }) {
  return (
    <div className="rank-list">
      <h2>{title}</h2>
      <ol>
        {places.map(p => (
          <li key={p.state}>
            <a href={`#${p.state}`}>{slugToTitle(p.state)}</a>
            <span className="score">{fmt(p.score, 2)}</span>
            <div className="chips">
              <Delta
                label="emissions"
                value={p.emissions.realChange}
                unit="%"
                higherIsBetter={false}
              />
              <Delta
                label="carbon-free"
                value={p.carbonFree.realChange}
                unit="%"
                digits={0}
                higherIsBetter={true}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Collapsed table of the biggest real carbon-free gains, DC excluded */
function CarbonFreeGains({ places, years, count = 10 }) {
  const gains = places
    .filter(p => p.rank)
    .sort(
      (a, b) =>
        b.carbonFree.realChange - a.carbonFree.realChange ||
        a.state.localeCompare(b.state)
    )
    .slice(0, count)

  return (
    <details className="gains">
      <summary>
        {count} biggest carbon-free power gains ({years.before} <Chevron />{" "}
        {years.after})
      </summary>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>State</th>
              <th>Carbon-free</th>
              <th>Change</th>
              <th>Main drivers (share change)</th>
              <th>Generation</th>
            </tr>
          </thead>
          <tbody>
            {gains.map(p => (
              <tr key={p.state}>
                <td>
                  <a href={`#${p.state}`}>{slugToTitle(p.state)}</a>
                </td>
                <td className="num">
                  {p.carbonFree.same}% <Chevron />{" "}
                  <strong>{p.carbonFree.after}%</strong>
                </td>
                <td>
                  <Delta
                    value={p.carbonFree.realChange}
                    unit="%"
                    digits={0}
                    higherIsBetter={true}
                  />
                </td>
                <td>
                  <ShareChips
                    changes={p.carbonFree.mixChange}
                    labels={FUEL_LABELS}
                    higherIsBetter={fuel => CLEAN_FUELS.includes(fuel)}
                    limit={3}
                  />
                </td>
                <td>
                  <Delta
                    value={p.generationTwh.realChange}
                    unit="%"
                    digits={0}
                    higherIsBetter={null}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

function Count({ label, counts }) {
  return (
    <div className="count">
      <div className="stat-label">{label}</div>
      <span className="delta -good">▲ {counts.better}</span>
      <span className="delta -bad">▼ {counts.worse}</span>
      {counts.same > 0 && <span className="delta -flat">■ {counts.same}</span>}
    </div>
  )
}

/**
 * A before/after report of how each state's key stats changed with a data
 * update, from a frozen snapshot made by scripts/build-data-update.mjs
 */
export default function DataUpdateReport({ data }) {
  const captions = getCaptions(data.years)
  const e = data.years.emissions
  const g = data.years.generation
  const ranked = data.places.filter(p => p.rank).sort((a, b) => a.rank - b.rank)

  return (
    <div className="data-update" id="top">
      <header className="report-header">
        <h1 id="main">2020 to 2025 Data Updates</h1>
        <div className="muted">
          <p>
            How each state's numbers changed when we updated our data sources in
            2026 to get new 2025 data (previously all data was as of 2020 -
            2021).
          </p>
          <p>
            This data update also spotted several problems with faulty data, so
            not all data is comparable.
          </p>
        </div>
        <div className="legend">
          Changes compare the same source over time. Numbers in brackets are
          what the site showed before.
        </div>
      </header>

      <section className="summary">
        <h2>Executive Summary</h2>
        <div className="counts">
          <Count
            label={
              <>
                States Emissions ({e.before} <Chevron /> {e.after})
              </>
            }
            counts={data.counts.emissions}
          />
          <Count
            label={
              <>
                State Carbon-Free Power ({g.before} <Chevron /> {g.after})
              </>
            }
            counts={data.counts.carbonFree}
          />
        </div>
        <div className="flagged">
          <span className="flag">⚑ New power source changed past values</span>
          {data.powerFlagged.map(state => (
            <a key={state} href={`#${state}`}>
              {slugToTitle(state)}
            </a>
          ))}
          <span className="muted">
            · these show the previous number in brackets
          </span>
        </div>
        <Stats
          place={data.us}
          captions={captions}
          placeTitle="the United States"
          headingName="US"
          emissionsByYear={data.us.emissionsByYear}
          showBars={false}
        />
      </section>

      <section className="rankings">
        <RankList title="5 most improved" places={ranked.slice(0, 5)} />
        <RankList title="5 most lagging" places={ranked.slice(-5).reverse()} />
      </section>

      <CarbonFreeGains places={data.places} years={data.years.generation} />

      <JumpNav places={data.places} />

      {data.places.map(p => (
        <StateCard
          key={p.state}
          place={p}
          captions={captions}
          rankedCount={data.rankedCount}
        />
      ))}

      <footer className="notes">
        <p>
          <strong>Score</strong> = {data.weights.emissions} × percentile of real
          emissions % change ({e.before} <Chevron /> {e.after}) +{" "}
          {data.weights.power} × percentile of real change in carbon-free % (
          {g.before} <Chevron /> {g.after}), across {data.rankedCount} states.
          DC not ranked.
        </p>
        <p>
          <strong>Emissions:</strong> WRI Climate Watch <Chevron /> EPA state
          inventory. <strong>Power:</strong> EIA API v1 <Chevron /> EIA bulk
          file. <strong>Wind & solar:</strong> EIA 2021, buggy formula{" "}
          <Chevron /> EIA {g.after}, fixed. <strong>EVs:</strong> AFDC 2020 /
          FHWA cars <Chevron /> AFDC 2025 / all light-duty.{" "}
          <strong>Homes:</strong> NREL appliances <Chevron />
          Census ACS 2024 heating fuel.
        </p>
        <p className="muted">Updated {data.generatedAt.slice(0, 10)}.</p>
      </footer>
    </div>
  )
}
