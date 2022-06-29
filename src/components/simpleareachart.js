import React, { useState } from "react"
import { Button } from "react-bootstrap"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  ReferenceDot
} from "recharts"

import DataModal from './data-modal'

export default function SimpleAreaChart ({ emissionsData, title }) {

  const YearDataKey = 'year'
  const EmissionsDataKey = 'hist'
  const ProjectionDataKey = 'projection'

  const annualHistoricEmissions = emissionsData.map((item) => {
    var data = { [YearDataKey]: item.year, [EmissionsDataKey]: 0 }

    data[EmissionsDataKey] = Math.round(100*Object.entries(item)
      .filter(([key, _val]) => key !== YearDataKey)
      .reduce((acc, [_key, val]) => acc + val, 0)) /100

    return data
  })

  const currYear = new Date().getFullYear()
  const yearsLeft = 2050 - currYear
  const reduceFrom
    = annualHistoricEmissions[annualHistoricEmissions.length - 1][EmissionsDataKey]
  var projection = []

  for (let step = 0; step < (yearsLeft + 1); step++) {
    if (step === 0) {
      projection.push({
        [YearDataKey]: currYear,
        [EmissionsDataKey]: reduceFrom,
        [ProjectionDataKey]: reduceFrom
      })
    }
    else {
      var rounded = (Math.round((reduceFrom - reduceFrom * step / yearsLeft) * 100)) / 100
      if (rounded < 0) { rounded = 0 }
      projection.push({ [YearDataKey]: step + currYear, [ProjectionDataKey]: rounded })
    }
  }

  var data = annualHistoricEmissions.concat(projection)
  const dataMidPoint = data.find(item => item.year === currYear)[EmissionsDataKey] / 2

  // Data headers for the modal
  const dataHeaders = [
    { title: 'Year', key: YearDataKey },
    { title: 'Gigatonnes CO2 Emitted', key: EmissionsDataKey },
    { title: 'Goal CO2 Emissions', key: ProjectionDataKey }
  ]

  const [showDataModal, setShowDataModal] = useState(false)

  const handleCloseModal = () => setShowDataModal(false)
  const handleShowModal = () => setShowDataModal(true)
  
  return (
    <>
      <ResponsiveContainer className="simplearea-cont">
        <AreaChart
          width={800}
          height={400}
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 0,
            bottom: 30
          }}
        >
          {/* <Legend align="center" verticalAlign="top" iconType="square" iconSize="15" /> */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={YearDataKey} >
            <Label value="Year" offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={EmissionsDataKey}
            stackId="1"
            stroke="#b65c00"
            fill="#e8ceb3"
            name="Emissions"
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey={ProjectionDataKey}
            stackId="2"
            stroke="#36a654"
            fill="#c1e5cb"
            name="Projection"
            isAnimationActive={false}
          />
          <ReferenceDot y={dataMidPoint} x={currYear-4} stroke="none" fill="none" label={{ value: "Emissions", angle: 90, fill: "#b65c00" }} />
          <ReferenceDot y={dataMidPoint} x={currYear+1} stroke="none" fill="none" label={{ value: "Projections", angle: 90, fill: "#36a654" }} />
        </AreaChart>
      </ResponsiveContainer>

      <Button variant="secondary" onClick={handleShowModal}>
        View Data Table
      </Button>

      <DataModal
        chartData={data}
        headers={dataHeaders}
        show={showDataModal}
        title={title}
        handleClose={handleCloseModal}></DataModal>
    </>
  )
}
