import React, { useState } from "react"
import StackedBarChart from "../components/stackedbar"
import ChoroplethMap from "./choroplethmap"
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

const PlaceDetail = ({location, placesData, emissions}) => {
  const currentPlace = location.pathname.split("/").filter(pathEl => pathEl.length).pop()
  const [placeData, setPlaceData] = useState(placesData[currentPlace])

  return (
    <div className='row d-flex flex-row'>
      <div className='col-12 col-lg-4'>
        <h1 className='mr-4 mb-3'>{placeData.name}</h1>
        <ChoroplethMap emissions={emissions} sidebar={false} selected_location={currentPlace}/>
      </div>
      <div className='col-12 col-lg-8'>
        <h4>Metric tons of carbon dioxide equivalent (MTCO2e) emissions</h4>
        <StackedBarChart emissions_data={placeData.emissions}/>
      </div>
    </div>
  )
}

export default PlaceDetail
