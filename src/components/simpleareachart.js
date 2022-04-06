import React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from "recharts"

export default function SimpleAreaChart ({emissions_data}) {

  const annualhistoricalEmissions = emissions_data.map((item) => {
    var data = { year: item.year, hist: 0 }
    data.hist = Math.round(Object.entries(item)
      .filter(([key, _val]) => key !== 'year')
      .reduce((acc, [_key, val]) => acc + val, 0))
    return data
  })

  const currYear = new Date().getFullYear()
  const yearsLeft = 2050 - currYear
  const reduceFrom = annualhistoricalEmissions[annualhistoricalEmissions.length - 1].hist
  var projection = []


  for (let step = 0; step < (yearsLeft + 1); step++) {
    if (step == 0) { projection.push({ year: currYear, hist: reduceFrom, projected: reduceFrom }) }
    else { projection.push({ year: step + currYear, projected: Math.round(reduceFrom - reduceFrom * step / yearsLeft)}) }
  }

  var data = annualhistoricalEmissions.concat(projection)
 
  return (
    <ResponsiveContainer width="100%" height={500}>
      <AreaChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        {/* <Legend align="center" verticalAlign="top" iconType="square" iconSize="15" /> */}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" >
          <Label value="Year" offset={0} position="insideBottom"/> 
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
        />
        <Area
          type="monotone"
          dataKey="projected"
          stackId="2"
          stroke="#36a654"
          fill="#c1e5cb"
          name="Projection"
        />
        <ReferenceLine x="2018" stroke="none" label={{value:"Emissions", angle:90, fill:"#b65c00"}} />
        <ReferenceLine x="2024" stroke="none" label={{value:"Projections", angle:90, fill:"#36a654"}} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
