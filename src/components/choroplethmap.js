import React, { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { intcomma } from "journalize"
import { FaCheck, FaInfoCircle } from "react-icons/fa"
import { SVGMap } from "react-svg-map"
import { Link, navigate  } from "gatsby"

import USMap from "../images/svg/usaStatesTerritories.js"
import jenks from "./jenks"

const convertSlug = (key) => {
  if (key === undefined || key === null)
    return null
  else {
    return key.replace(" of "," Of ").replace(/ /g,"_")
  }
}

const CustomHover = ({ emissions, activeRegion }) => {
  if (emissions[convertSlug(activeRegion.name)] != null) {
    return (
      <>
        <strong>{activeRegion.name}</strong><br />
        {emissions[convertSlug(activeRegion.name)]} MTCO2e
      </>
    )
  } else {
    return (
      <>
        <strong>{activeRegion.name}</strong><br />
        Data not available
      </>
    )
  }
}

const mouseOver = (event, setActiveRegion) => {
  const current = event.target
  if(current.id !== "frames") {
    current.setAttribute("style", "stroke:#421B49;stroke-width:2;")
  }
  const newActiveRegion = {
    id: current.getAttribute("id"),
    name: current.getAttribute("name")
  }

  setActiveRegion(newActiveRegion)
}

const mouseOut = (event, setActiveRegion, setTooltipStyle) => {
  const current = event.target
  current.setAttribute("style", "")
  const newActiveRegion = {
    id: current.getAttribute("id"),
    name: current.getAttribute("name")
  }
  const newTooltipStyle = {display: "none"}
  setActiveRegion(newActiveRegion)
  setTooltipStyle(newTooltipStyle)
}

const mouseMove = (event, setActiveRegion, setTooltipStyle) => {
  const newTooltipStyle = {
    display: "block",
    position: "fixed",
    top: event.clientY + 10,
    left: event.clientX + 10,
    backgroundColor: "white",
    border: "1px solid #333",
    padding: "5px",
    color: "black",
    minHeight: "40px",
    minWidth: "100px",
    zIndex: 5
  }
  setTooltipStyle(newTooltipStyle)
}

const handleClick = (event, activeRegion) => {
  navigate(`/place/${activeRegion.id}`)
}

const getBuckets = (emissions, numBuckets) => {
  const buckets = jenks(Object.values(emissions), numBuckets)
  return buckets
}

const ChoroplethMap = ({emissions, sidebar = true}) => {
  const [activeRegion, setActiveRegion] = useState({id: undefined, name: undefined})
  const [tooltipStyle, setTooltipStyle] = useState({display: "none"})
  const [buckets, setBuckets] = useState([])

  useEffect(() => {
    if (emissions) {
      setBuckets(getBuckets(emissions, 4))
    }
  }, [emissions])

  const getClass = (location) => {
    if (emissions) {
      if (location.id === "frames") {
        return "svg-map__location"
      }
      const buckets = getBuckets(emissions, 4)
      const locationData = emissions[convertSlug(location.name)]
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
      return `svg-map__location state choropleth${bucket}`
    }
    return `svg-map__location state`
  }

  return (
    <>
      <div style={tooltipStyle}>
        <CustomHover emissions={emissions} activeRegion={activeRegion}/>
      </div>
      <Row>
        {emissions && sidebar ?
          <Col lg={3}>
            <h6>Metric tons of carbon dioxide equivalent (MTCO2e) emissions in 2018</h6>
            {buckets.map((bucket, i) => {
              const colorClass = `keyColor choropleth${i}`
              const bucketInfo = bucket === null ? 
                `0 - ${buckets[i + 1]}` :
                (buckets[i + 2] ? 
                  `${bucket} - ${buckets[i + 1]}` : 
                  `${bucket} - ${buckets[i + 1]}`
                )
              return (
                <div key={i}>
                  {buckets[i+1] ?
                    <div className="legendKey">
                      <span className={ colorClass }></span>
                      <span className="keyText">{ bucketInfo }</span>
                    </div> : null }
                </div>
              )
            })}
            <div className="legendKey">
              <span className="keyColor choroplethNull"></span>
              <span className="keyText">Data not available</span>
            </div>
          </Col>: null
        }
        <Col lg={{span: 9, offset: (emissions && sidebar ? 0 : 3)}}>
          <SVGMap
            map={USMap}
            locationClassName={getClass}
            onLocationMouseOver={(e) => {mouseOver(e, setActiveRegion)}}
            onLocationMouseOut={(e) => {mouseOut(e, setActiveRegion, setTooltipStyle)}}
            onLocationMouseMove={(e) => {mouseMove(e, setActiveRegion, setTooltipStyle)}}
            onLocationClick={(e) => {handleClick(e, activeRegion)}}
          />
        </Col>
      </Row>
    </>
  )
}

export default ChoroplethMap
