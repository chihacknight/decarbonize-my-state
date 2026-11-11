import React, { useEffect, useRef, useState } from "react"

import SingleBarChart from "../singlebar"
import PowerSourcesChart from "../power-sources-chart"

export const SECTOR_LABELS = {
  dirty_power: "Power",
  buildings: "Buildings",
  transportation: "Transport",
  dumps_farms_industrial_other: "Other",
}

export const FUEL_LABELS = {
  coal: "Coal",
  natural_gas: "Gas",
  petro_liquids: "Oil",
  nuclear: "Nuclear",
  hydro_electric: "Hydro",
  all_solar: "Solar",
  wind: "Wind",
}

export const fmt = (num, digits = 1) =>
  num === null || num === undefined
    ? "–"
    : Number(num).toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })

/**
 * A signed change with an arrow, green when good and red when bad
 *
 * @param {number} value The change
 * @param {string} unit The unit after the number, e.g. "%"
 * @param {boolean} higherIsBetter Whether an increase is good
 */
export function Delta({ value, unit, higherIsBetter, label, digits = 1 }) {
  if (value === null || value === undefined) {
    return <span className="delta -none">{label} n/a</span>
  }
  // null means neither direction is good, e.g. emission shares
  const good = higherIsBetter ? value > 0 : value < 0
  const tone =
    value === 0 || higherIsBetter === null ? "-flat" : good ? "-good" : "-bad"
  // The arrow shows the direction, so the number is unsigned
  const arrow = value === 0 ? "■" : value > 0 ? "▲" : "▼"
  return (
    <span className={`delta ${tone}`}>
      {label && <span className="delta-label">{label}</span>}
      {arrow} {fmt(Math.abs(value), digits)}
      {unit}
    </span>
  )
}

/** A chevron separator, centred on the text instead of the baseline */
export const Chevron = () => (
  <svg className="chevron" viewBox="0 0 8 12" aria-hidden="true">
    <path d="M2 1.5 6.5 6 2 10.5" />
  </svg>
)

/** Render children only once the element is close to the viewport */
export function Lazy({ height, children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (visible || !ref.current) {
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "800px 0px" }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div ref={ref} style={visible ? undefined : { minHeight: height }}>
      {visible && children}
    </div>
  )
}

/** One labelled site chart in a before/after row */
function ChartCell({ caption, children }) {
  return (
    <figure className="chart-cell">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

/** Three emissions bars: main, new source old year, new source new year */
export function EmissionsBars({ charts, captions }) {
  return (
    <Lazy height={380}>
      <div className="chart-row -bars">
        {["before", "same", "after"].map(key => (
          <ChartCell key={key} caption={captions[key]}>
            <SingleBarChart emissionsData={charts[key]} />
          </ChartCell>
        ))}
      </div>
    </Lazy>
  )
}

/** Two power pies: main and branch */
export function PowerPies({ charts, captions, placeTitle }) {
  return (
    <Lazy height={300}>
      {/* The pie chart's styles are scoped to the state page */}
      <div className="chart-row -pies state-details-main">
        {["before", "after"].map(key => (
          <ChartCell key={key} caption={captions[key]}>
            <PowerSourcesChart
              latestGeneration={charts[key]}
              placeTitle={placeTitle}
              isAnimationActive={false}
            />
          </ChartCell>
        ))}
      </div>
    </Lazy>
  )
}

/**
 * A stat group with its own heading. The main row compares the new source's
 * old and new years, e.g. "256.8 › 225.3 MMT ▼ 12.3%", since that's the real
 * change. With `showPrevious`, the number the site showed before follows in
 * brackets with how much the new source alone changed it. Labels name the
 * source and years under each part.
 */
export function ThreeWay({
  label,
  stat,
  unit,
  changeUnit,
  higherIsBetter,
  digits,
  labels,
  showPrevious,
}) {
  return (
    <div className="stat-group">
      <h4 className="stat-heading">{label}</h4>
      <div className="stat-blocks">
        <div className="stat-block">
          <div className="stat-values">
            <span className="v -before">{fmt(stat.same, digits)}</span>
            <Chevron />
            <span className="v -after">
              {fmt(stat.after, digits)}
              <span className="unit">{unit}</span>
            </span>
            <Delta
              value={stat.realChange}
              unit={changeUnit}
              higherIsBetter={higherIsBetter}
            />
          </div>
          <div className="stat-sublabel">{labels.main}</div>
        </div>
        {showPrevious && (
          <div className="stat-block -previous">
            <div className="stat-previous">
              {/* Only a % sticks to the number, other units are in the main row */}
              (previously {fmt(stat.before, digits)}
              {unit === "%" && "%"} ·{" "}
              {/* A source change isn't good or bad, so the chip is neutral */}
              <Delta
                value={stat.sourceEffect}
                unit={changeUnit}
                higherIsBetter={null}
              />{" "}
              from new source)
            </div>
            <div className="stat-sublabel">{labels.previous}</div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * A compact tile for stats with no same-source value, so only before › after.
 * The caption names each side's source since the method changed.
 */
export function StatTile({ label, stat, unit, caption }) {
  return (
    <div className="stat-tile">
      <h4 className="stat-heading">{label}</h4>
      <div className="stat-values">
        <span className="v -before">{fmt(stat.before)}</span>
        <Chevron />
        <span className="v -after">
          {fmt(stat.after)}
          <span className="unit">{unit}</span>
        </span>
        <Delta value={stat.total} unit="%" higherIsBetter={true} />
      </div>
      <div className="stat-caption">{caption}</div>
    </div>
  )
}

/** Small chips for each sector or fuel's share change */
export function ShareChips({ lead, changes, labels, higherIsBetter, limit }) {
  return (
    <div className="chips">
      {lead && <span className="chips-lead">{lead}</span>}
      {Object.entries(changes)
        .filter(([, v]) => v !== null && Math.abs(v) >= 0.5)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .slice(0, limit)
        .map(([key, v]) => (
          <Delta
            key={key}
            label={labels[key]}
            value={v}
            unit="%"
            digits={0}
            higherIsBetter={higherIsBetter(key)}
          />
        ))}
    </div>
  )
}
