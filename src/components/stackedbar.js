import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const barColors = ["#984ea3", "#4daf4a", "#377eb8", "#e41a1c"]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <strong>{label}</strong>
        <br />
        <table className="table table-sm table-bordered">
          <thead>
            <tr>
              <th>Source</th>
              <th>
                <span className="float-right">Percent</span>
              </th>
              <th>
                <span className="float-right">MMTCO2e</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <TooltipItem payload={payload} index={3} />
            <TooltipItem payload={payload} index={2} />
            <TooltipItem payload={payload} index={1} />
            <TooltipItem payload={payload} index={0} />
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <th></th>
              <th>
                <span className="float-right">
                  {getTotal(payload)
                    .toFixed(1)
                    .toLocaleString("en-US")}
                </span>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }

  return null
}

const TooltipItem = ({ payload, index }) => {
  return (
    <tr>
      <td>
        <span style={{ color: barColors[index] }}>{payload[index].name}</span>
      </td>
      <td>
        <span style={{ color: barColors[index] }} className="float-right">
          {calcPercent(payload, index)}%
        </span>
      </td>
      <td>
        <span style={{ color: barColors[index] }} className="float-right">
          {payload[index].value.toFixed(1).toLocaleString("en-US")}
        </span>
      </td>
    </tr>
  )
}

function getTotal(payload) {
  return (
    payload[0].value + payload[1].value + payload[2].value + payload[3].value
  )
}

function calcPercent(payload, index) {
  return ((100 * payload[index].value.toFixed(1)) / getTotal(payload)).toFixed(
    1
  )
}

const StackedBarChart = ({ emissions_data }) => {
  if (emissions_data) {
    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          width={500}
          height={300}
          data={emissions_data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="dumps_farms_industrial_other"
            name="Dumps, farms, industrial & other"
            stackId="a"
            fill={barColors[0]}
          />
          <Bar
            dataKey="transportation"
            name="Transportation"
            stackId="a"
            fill={barColors[1]}
          />
          <Bar
            dataKey="buildings"
            name="Buildings"
            stackId="a"
            fill={barColors[2]}
          />
          <Bar
            dataKey="dirty_power"
            name="Dirty power"
            stackId="a"
            fill={barColors[3]}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  } else {
    return <span className="float-right">Data not available</span>
  }
}

export default StackedBarChart
