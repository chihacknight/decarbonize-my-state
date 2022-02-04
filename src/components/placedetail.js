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
  
  function detailLink (cell, row) {
    if (cell) {
      return (
        <Link to={`/job/${row.occupation_slug}`}>
          {cell}
        </Link>
      )
    }
  }

  function intToString (cell, row) {
    if (cell) {
      return (
        intcomma(cell)
      )
    }
  }

  function formatPercent (cell, row) {
    if (cell) {
      return (
        <span>
          {cell.toFixed(1)}%
        </span>
      )
    }
  }

  const columns = [
    {
      dataField: 'rank',
      text: 'Rank',
      sort: true,
      headerStyle: { width: '10%' },
      style: { width: '10%' }
    },
    {
      dataField: 'occupation',
      text: 'Occupation',
      formatter: detailLink,
      sort: true,
      headerStyle: { width: '40%' },
      style: { width: '40%' }
    },
    {
      dataField: 'concentration',
      text: 'Job concentration',
      formatter: formatPercent,
      sort: true,
      headerStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
      style: { textAlign: 'right' }
    },
    {
      dataField: 'total_employed',
      text: 'Total employed',
      formatter: intToString,
      sort: true,
      headerStyle: { textAlign: 'right', whiteSpace: 'nowrap' },
      style: { textAlign: 'right' }
    }
  ]

  return (
    <div className='row d-flex flex-row'>
      <div className='col-12 col-lg-3'>
        <h1 className='mr-4 mb-3'>{placeData.name}</h1>
        <p>Total employed: {intcomma(placeData.total)}</p>
        <SVGMap
          map={USMap}
          locationClassName={getClass}
        />
      </div>
      <div className='col-12 col-lg-9'>
        <h3>Top common green jobs in <strong>{placeData.name}</strong> by concentration</h3>
        <div>Some occupations are concentrated more in certain places than others. This depends on each state's unique mix of natural resources and industries. <strong>Job concentration</strong> measures what percentage of all jobs in this occupation are found in this state / territory.</div>
        <BootstrapTable
          keyField='occupation_slug'
          wrapperClasses='table-responsive'
          classes='mt-4'
          data={ placeData.ranks }
          columns={ columns }
          bootstrap4
        />
      </div>
    </div>
  )
}

export default PlaceDetail
