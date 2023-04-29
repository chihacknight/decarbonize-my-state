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
  ReferenceDot,
} from "recharts"

import DataModal from "./data-modal"

export default function SimpleAreaChart({ emissionsData, title }) {
  const YearDataKey = "year"
  const EmissionsDataKey = "hist"
  const ProjectionDataKey = "projection"
  const MissingDataKey = "missingData"

  const annualHistoricEmissions = emissionsData.map(item => {
    var data = { [YearDataKey]: item.year, [EmissionsDataKey]: 0 }

    data[EmissionsDataKey] =
      Math.round(
        100 *
          Object.entries(item)
            .filter(([key, _val]) => key !== YearDataKey)
            .reduce((acc, [_key, val]) => acc + val, 0)
      ) / 100

    return data
  })
  const currYear = new Date().getFullYear()
  const yearsLeft = 2050 - currYear
  const reduceFrom =
    annualHistoricEmissions[annualHistoricEmissions.length - 1][
      EmissionsDataKey
    ]
  const lastYear = annualHistoricEmissions.slice(-1)[0].year
  var projection = []
  var missing = []

  //Since there is a lag in the available data and the current year, years without emissions data yet
  //need to be included in the graph so a "gap" does not occur.  This fills in the missing years
  //with an assumptive emissions data which will be used to create an area on the graph where no
  //data has been generated yet.

  //A loop is used to create data for the missing years.  Since this is a different area on the graph
  //a new key, missingData is used.  This data is pushed into a array which will ultimately be
  //concatinated into the data array.
  for (let step = 0; step < currYear - lastYear - 1; step++) {
    if (step === 0) {
      missing.push({
        year: lastYear + 1,
        hist: reduceFrom,
        missingData: reduceFrom,
      })
    } else {
      missing.push({ year: 1 + step + lastYear, missingData: reduceFrom })
    }
  }

  for (let step = 0; step < yearsLeft + 1; step++) {
    if (step === 0) {
      projection.push({
        [YearDataKey]: currYear,
        [MissingDataKey]: reduceFrom,

        [ProjectionDataKey]: reduceFrom,
      })
    } else {
      var rounded =
        Math.round((reduceFrom - (reduceFrom * step) / yearsLeft) * 100) / 100
      if (rounded < 0) {
        rounded = 0
      }
      projection.push({
        [YearDataKey]: step + currYear,
        [ProjectionDataKey]: rounded,
      })
    }
  }

  var data = annualHistoricEmissions.concat(missing).concat(projection)
  const dataMidPoint = reduceFrom / 3

  // Data headers for the modal
  const dataHeaders = [
    { title: "Year", key: YearDataKey },
    { title: "Gigatonnes CO2 Emitted", key: EmissionsDataKey },
    { title: "Goal CO2 Emissions", key: ProjectionDataKey },
  ]

  const [showDataModal, setShowDataModal] = useState(false)

  const handleCloseModal = () => setShowDataModal(false)
  const handleShowModal = () => setShowDataModal(true)

  return (
    <>
      <ResponsiveContainer className="simplearea-cont">
        <AreaChart
          width={800}
          height={200}
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 0,
            bottom: 30,
          }}
        >
          {/* <Legend align="center" verticalAlign="top" iconType="square" iconSize="15" /> */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={YearDataKey}>
            <Label value="Year" offset={-15} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label
              value="CO2e (million metric tons)"
              offset={10}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
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
            strokeDasharray="4 4"
            type="monotone"
            dataKey="missingData"
            stackId="3"
            stroke="#505050"
            fill="#ababab"
            name="Assumed"
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
          <ReferenceDot
            y={dataMidPoint}
            x={currYear - 20}
            stroke="none"
            fill="none"
            label={{ value: "Emissions", fontSize: "1.5rem", fill: "#b65c00" }}
          />
          <ReferenceDot
            y={dataMidPoint}
            x={1 + (currYear + lastYear) / 2}
            stroke="none"
            fill="none"
          />
          <ReferenceDot
            y={dataMidPoint}
            x={currYear + 8}
            stroke="none"
            fill="none"
            label={{
              value: "Projections",
              fontSize: "1.5rem",
              fill: "#36a654",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="table-btn-cont mt-2">
        <Button variant="secondary" onClick={handleShowModal}>
          View Data Table
        </Button>
      </div>

      <DataModal
        chartData={data}
        headers={dataHeaders}
        show={showDataModal}
        title={title}
        handleClose={handleCloseModal}
      ></DataModal>
    </>
  )
}
