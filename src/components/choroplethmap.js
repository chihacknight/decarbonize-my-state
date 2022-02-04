import React, { useState, useEffect } from "react"
import { Row, Col } from "react-bootstrap"
import { intcomma } from "journalize"
import { FaCheck, FaInfoCircle } from "react-icons/fa"
import { SVGMap } from "react-svg-map"
import { Link, navigate  } from "gatsby"

import USMap from "../images/svg/usaStatesTerritories.js"
import stateValues from "./statevalues"
import jenks from "./jenks"

const CustomHover = ({ occupation, activeRegion }) => {
  if (occupation) {
    if (occupation[activeRegion.id] === null || occupation[activeRegion.id] === '') {
      return (
        <>
          <strong>{activeRegion.name}</strong><br />
          Data not available for {occupation.occupation}
        </>
      )
    } else {
      if (occupation.occupation) {
        return (
          <>
            <strong>{activeRegion.name}</strong><br />
            {occupation[activeRegion.id + '_perthousand']} employees in this occupation per 10,000 jobs<br />
            {intcomma(occupation[activeRegion.id])} employees total in this occupation
          </>
        )
      } else {
        return (
          <>
            <strong>{activeRegion.name}</strong><br />
            {occupation[activeRegion.id + '_perthousand']}% all green jobs here<br />
            {intcomma(occupation[activeRegion.id])} total workers employed
          </>
        )
      }
      
    }
  } else {
    return (
      `Select an occupation above`
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

const getBuckets = (occupation, numBuckets) => {
  const buckets = jenks(stateValues(occupation), numBuckets)
  return buckets
}

const ChoroplethMap = ({occupation, sidebar = true}) => {
  const [activeRegion, setActiveRegion] = useState({id: undefined, name: undefined})
  const [tooltipStyle, setTooltipStyle] = useState({display: "none"})
  const [buckets, setBuckets] = useState([])

  useEffect(() => {
    if (occupation) {
      setBuckets(getBuckets(occupation, 4))
    }
  }, [occupation])

  const getClass = (location) => {
    if (occupation) {
      if (location.id === "frames") {
        return "svg-map__location"
      }
      const buckets = getBuckets(occupation, 4)
      const locationData = occupation[location.id + '_perthousand']
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
        <CustomHover occupation={occupation} activeRegion={activeRegion}/>
      </div>
      <Row>
        {occupation && sidebar ?
          <Col lg={3}>
            { occupation.occupation ?
              <>
                <h4><Link to={`/job/${occupation.occupation_slug}`}>{ occupation.occupation }</Link></h4>
                <p>
                  {occupation.green_job ? <strong className={ 'sunrise-green' }><FaCheck /> common green job</strong> : <strong>Not a common green job</strong>} <Link to={`/about#green-job-faq`} state={{ greenJobFAQ: true }}><FaInfoCircle /></Link><br />
                  Total employed: {intcomma(occupation.total_employed)}<br />
                  <Link to={`/job/${occupation.occupation_slug}`}>Learn more &raquo;</Link>
                  <br /><Link to={`/compare/?job1=${occupation.occupation_slug}`}>Compare to other occupations &raquo;</Link>
                </p>
                <hr />
                <h6># of workers per 10,000 employees in state/territory</h6>
              </> : 
              <>
                <h4>Which states and territories have the most green jobs?</h4>
                <hr />
                <h6>Percentage of common green jobs</h6>
              </>
            }
                
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
        <Col lg={{span: 9, offset: (occupation && sidebar ? 0 : 3)}}>
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
