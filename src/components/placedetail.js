import React, { useState } from "react"
import { Link } from "gatsby"
import BootstrapTable from 'react-bootstrap-table-next'
import { intcomma } from "journalize"
import { SVGMap } from "react-svg-map"
import USMap from "../images/svg/usaStatesTerritories.js"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

const PlaceDetail = ({location, placesData}) => {
  const currentPlace = location.pathname.split("/").pop()
  const [placeData, setPlaceData] = useState(placesData[currentPlace])

  const getClass = (location) => {
    if (location.id === currentPlace)
    {return `svg-map__location state choropleth1`}
    else
    {return "svg-map__location state"}
  }

  return (
    <div className='row d-flex flex-row'>
      <div className='col-12 col-lg-3'>
        <h1 className='mr-4 mb-3'>{placeData.name}</h1>
        <SVGMap
          map={USMap}
          locationClassName={getClass}
        />
      </div>
    </div>
  )
}

export default PlaceDetail
