import React, { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { SVGMap } from "react-svg-map"
import { navigate } from "gatsby"

import USMap from "../images/svg/usaStatesNoTerritories.js"
import jenks from "./jenks"
import { getShortCitation } from "../constants/source-citations"

function CustomHover({ emissions, activeRegion }) {
  if (emissions[activeRegion.id] != null) {
    return (
      <>
        <strong className="h6">{activeRegion.name}</strong>
        <br />
        {emissions[activeRegion.id]} MMTCO<sub>2</sub>e<br />
        <div className="font-weight-bold mb-1">
          <u>View Details</u>
        </div>
      </>
    )
  } else {
    return (
      <>
        <strong>{activeRegion.name}</strong>
        <br />
        Data not available
      </>
    )
  }
}

function getActiveRegionFromElem(elem) {
  const newActiveRegion = {
    id: elem.getAttribute("id"),
    name: elem.getAttribute("name"),
  }

  return newActiveRegion
}

function mouseOver(event, setActiveRegion, setTooltipStyle) {
  const targetElem = event.target

  if (targetElem.id !== "frames") {
    // TODO: Add a class - no CSS mutation in JS!
    targetElem.setAttribute("style", "stroke:#421B49;stroke-width:2;")
  }

  setActiveRegion(getActiveRegionFromElem(event.target))
  showTooltip(targetElem, setTooltipStyle)
}

function mouseOut(event, setActiveRegion, setTooltipStyle) {
  const targetElem = event.target
  targetElem.setAttribute("style", "")

  setActiveRegion(getActiveRegionFromElem(targetElem))
  hideTooltip(setTooltipStyle)
}

function showTooltip(targetElem, setTooltipStyle) {
  const targetRect = targetElem.getBoundingClientRect()

  // These two values are absolute, so they will move the tooltip the same
  // number of pixels for tiny states (like DC) and large ones (like Texas)
  let tooltipYOffsetPx = 0
  let tooltipXOffsetPx = -3

  // We subtract these from the coords to align by top center by default
  const tooltipHeight = 88
  const tooltipWidth = 180

  const stateWidth = targetRect.width
  const stateHeight = targetRect.height

  const partialStateHeight = stateHeight * 0.5

  // Custom offsets for certain states whose tooltip pointerss end up in
  // spots (like the ocean or another state)
  if (targetElem.id === "florida") {
    tooltipXOffsetPx += stateWidth * 0.25
  } else if (targetElem.id === "louisiana" || targetElem.id === "california") {
    tooltipXOffsetPx -= stateWidth * 0.15
  } else if (targetElem.id === "maryland") {
    tooltipYOffsetPx -= stateHeight * 0.25
  } else if (targetElem.id === "michigan") {
    tooltipXOffsetPx += stateWidth * 0.3
    tooltipYOffsetPx += stateHeight * 0.3
  }

  const centerX = targetRect.x + stateWidth / 2 - tooltipWidth / 2
  const topY = targetRect.y - tooltipHeight

  const x = centerX + tooltipXOffsetPx
  const y = topY + partialStateHeight + tooltipYOffsetPx

  const newTooltipStyle = {
    opacity: 1,
    top: y,
    left: x,
  }

  setTooltipStyle(newTooltipStyle)
}

function hideTooltip(setTooltipStyle) {
  setTooltipStyle({ opacity: 0 })
}

function focus(event, setActiveRegion, setTooltipStyle) {
  const targetElem = event.target

  showTooltip(targetElem, setTooltipStyle)

  setActiveRegion(getActiveRegionFromElem(event.target))
}

function blur(event, setTooltipStyle) {
  hideTooltip(setTooltipStyle)
}

/**
 * Handles clicking or pressing enter after tabbing into a state, navigating
 * to that state
 */
function handleClick(event, activeRegion) {
  const newUrl = `/${activeRegion.id}`

  // If Ctrl is held, open a new tab, otherwise navigate this page
  if (event.ctrlKey) {
    window.open(newUrl)
  }
  else {
    navigate(newUrl)
  }
}

function handleKeydown(event, activeRegion) {
  if (event.key === "Enter") {
    handleClick(null, activeRegion)
  }
}

function getBuckets(emissions, numBuckets) {
  const buckets = jenks(Object.values(emissions), numBuckets)
  return buckets
}

const StateEmissionsMap = ({
  emissions,
  sidebar = true,
  selected_location = {},
}) => {
  const [activeRegion, setActiveRegion] = useState({
    id: undefined,
    name: undefined,
  })
  const [tooltipStyle, setTooltipStyle] = useState({ opacity: 0 })
  const [buckets, setBuckets] = useState([])

  useEffect(() => {
    if (emissions) {
      setBuckets(getBuckets(emissions, 4))
    }
  }, [emissions])

  const getClass = location => {
    if (emissions) {
      if (location.id === "frames") {
        return "svg-map__location"
      }
      var mapClass = "svg-map__location state"
      if (location.id === selected_location) {
        mapClass += " mapSelected"
      }
      const buckets = getBuckets(emissions, 4)
      const locationData = emissions[location.id]
      let bucket
      if (locationData === null) {
        bucket = "Null"
      } else if (locationData >= buckets[3]) {
        bucket = 3
      } else if (locationData >= buckets[2]) {
        bucket = 2
      } else if (locationData >= buckets[1]) {
        bucket = 1
      } else if (locationData >= buckets[0]) {
        bucket = 0
      }
      return mapClass + ` choropleth${bucket}`
    }
    return `svg-map__location state`
  }

  return (
    <>
      {/* A skip link for keyboard users to not have to tab through every state to get past the map */}
      <a
        className="btn btn-outline-dark sr-only sr-only-focusable"
        href="#after-map"
      >
        Skip map
      </a>

      {/* The tooltip event */}
      <div
        style={tooltipStyle}
        className="map-tooltip tooltip bs-tooltip-top"
        role="tooltip"
      >
        <div className="arrow"></div>
        <div className="tooltip-inner">
          <CustomHover emissions={emissions} activeRegion={activeRegion} />
        </div>
      </div>
      <Row className="map-row">
        {emissions && sidebar ? (
          <Col lg={3} className="map-legend">
            <div className="h6 mt-4 font-weight-bold">
              Annaul Climate Pollution
            </div>
            <div className="legendKey">
              <span className="keyText">
                In millions of metric tons of CO<sub>2</sub> equivalent
              </span>
            </div>
            {buckets.map((bucket, i) => {
              const colorClass = `keyColor choropleth${i}`
              const bucketInfo =
                bucket === null
                  ? `0 - ${buckets[i + 1] - 1}`
                  : buckets[i + 2]
                  ? `${bucket} - ${buckets[i + 1] - 1}`
                  : `${bucket} - ${buckets[i + 1] - 1}`
              return (
                <div key={i}>
                  {buckets[i + 1] ? (
                    <div className="legendKey">
                      <span className={colorClass}></span>
                      <span className="keyText">{bucketInfo}</span>
                    </div>
                  ) : null}
                </div>
              )
            })}
            <div className="legendKey">
              <span className="keyColor choroplethNull"></span>
              <span className="keyText">Data not available</span>
            </div>
            <br />
            <span className="text-secondary keyText">
              Source: {getShortCitation("emissions")}
            </span>
          </Col>
        ) : null}
        <Col lg={{ span: sidebar ? 9 : 12 }}>
          <SVGMap
            map={USMap}
            locationClassName={getClass}
            locationRole="link"
            onLocationFocus={e => {
              focus(e, setActiveRegion, setTooltipStyle)
            }}
            onLocationMouseOver={e => {
              mouseOver(e, setActiveRegion, setTooltipStyle)
            }}
            onLocationMouseOut={e => {
              mouseOut(e, setActiveRegion, setTooltipStyle)
            }}
            onLocationBlur={e => {
              blur(e, setTooltipStyle)
            }}
            onLocationClick={e => {
              handleClick(e, activeRegion)
            }}
            onLocationKeyDown={e => {
              handleKeydown(e, activeRegion)
            }}
          />
        </Col>
      </Row>

      {/* A target for the skip link */}
      <div id="after-map"></div>
    </>
  )
}

export default StateEmissionsMap
