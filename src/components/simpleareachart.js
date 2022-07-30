import React from "react"
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

export default function SimpleAreaChart ({ emissions_data }) {

  const annualhistoricalEmissions = emissions_data.map((item) => {
    var data = { year: item.year, hist: 0 }
    data.hist = Math.round(100*Object.entries(item)
      .filter(([key, _val]) => key !== 'year')
      .reduce((acc, [_key, val]) => acc + val, 0))/100
    return data
  })

  const currYear = new Date().getFullYear()
  const yearsLeft = 2050 - currYear
  const reduceFrom = annualhistoricalEmissions[annualhistoricalEmissions.length - 1].hist
  const lastYear = annualhistoricalEmissions[annualhistoricalEmissions.length - 1].year
  var projection = []
  var missing = []

  for (let step = 0; step < (currYear-lastYear-1); step++) {
    if (step === 0) { missing.push({ year: lastYear+1, hist: reduceFrom, missingData: reduceFrom }) }
    else { 
      missing.push({year:1+step+lastYear,missingData:reduceFrom})
    }
  }



  for (let step = 0; step < (yearsLeft + 1); step++) {
    if (step === 0) { projection.push({ year: currYear, missingData: reduceFrom, projected: reduceFrom }) }
    else {
      var rounded = (Math.round((reduceFrom - reduceFrom * step / yearsLeft) * 100)) / 100
      if (rounded < 0) { rounded = 0 }
      projection.push({ year: step + currYear, projected: rounded })
    }
  }

  var data = annualhistoricalEmissions.concat(missing).concat(projection)
  const dataMidPoint = reduceFrom/2
  // const dataMidPoint = data.find(item => item.year === currYear).projected / 2
  
    return (
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
        <XAxis dataKey="year" >
          <Label value="Year" offset={-15} position="insideBottom" />
        </XAxis>
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="hist"
          stackId="1"
          stroke="#b65c00"
          fill="#e8ceb3"
          name="Emissions"
          isAnimationActive={false}
        />
        <Area
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
          dataKey="projected"
          stackId="2"
          stroke="#36a654"
          fill="#c1e5cb"
          name="Projection"
          isAnimationActive={false}
        />
        <ReferenceDot y={dataMidPoint} x={lastYear} stroke="none" fill="none" label={{ value: "Emissions", angle: 90, fill: "#b65c00" }} />
        <ReferenceDot y={dataMidPoint} x={1+(currYear+lastYear)/2} stroke="none" fill="none" label={{ value: "Missing Data", angle: 90, fill: "#505050" }} />
        <ReferenceDot y={dataMidPoint} x={currYear+1} stroke="none" fill="none" label={{ value: "Projections", angle: 90, fill: "#36a654" }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
