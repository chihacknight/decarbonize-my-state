import React from "react"
import { BarChart, Bar, LabelList, CartesianGrid, ReferenceArea, YAxis } from "recharts"

/* Calculate a rounded percentage given a value and the total it's out of */
const getPct = (value, total) => { return Math.round((value/total)*100) }

/** Create the label text with the percentage */
const getLabel = (entry, total, field, label) => {
  return `${label}: ${getPct(entry[field], total)}%`
}

/**
 * Create constants for bar and graph dimensions for calculating lines
 */
const BarWidth = 275
const GraphWidth = 375
const GraphHeight = 350

/**
 * A vertically stacked bar chart intended to show the groups of different
 * emissions. Has the following input props:
 *
 * @param emissionsData with type
 *
 * {
 *   buildings: number;
 *   dirty_power: number;
 *   dumps_farms_industrial_other: number;
 *   transportation: number;
 *   year: number;
 * }
 *
 * @param {boolean} showLines
 */
export default function SingleBarChart ({ emissionsData, showLines }) {
  // sum all emissions fields except year
  const emissionsTotal = Object.entries(emissionsData)
    .filter(([key,_val]) => key !== 'year')
    .reduce((acc, [_key,val]) => acc + val, 0)

  // To draw our lines we need to know the % of emissions that are handled by
  // clean electrification. We do this by finding the non-electrifiable percent
  // and then doing an inverse
  const nonElectrificationPrcnt = getPct(emissionsData.dumps_farms_industrial_other, emissionsTotal)
  const electrificationPrcnt = 100 * (1 - (nonElectrificationPrcnt / 100))

  const LabelOffset = 12

  return (
    <div className="single-bar-chart">
      <BarChart
        barSize={ BarWidth }
        width={ GraphWidth }
        height={ GraphHeight}
        data={[emissionsData]}
        margin={{
          top: 0,
          right: 100,
          left: 0,
          bottom: 0
        }}
      >
        { /* Make sure the y-axis matches the data exactly so the bars take up 100% of the height */ }
        <YAxis domain={['dataMin', 'dataMax']} hide={ true } />
        <CartesianGrid strokeDasharray="0 99" />
        <Bar dataKey="dumps_farms_industrial_other" stackId="main" fill="#98886c">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, 'dumps_farms_industrial_other', 'Farms, Industrial & Other')}
            position="insideTopLeft"
            offset={LabelOffset}/>
        </Bar>
        <Bar dataKey="transportation" stackId="main" fill="#b7b7b7">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, 'transportation', 'Transportation')}
            position="insideTopLeft"
            offset={LabelOffset}/>
        </Bar>
        <Bar dataKey="buildings" stackId="main" fill="#d9d9d9">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, 'buildings', 'Buildings')}
            position="insideTopLeft"
            offset={LabelOffset}/>
        </Bar>
        <Bar dataKey="dirty_power" stackId="main" fill="#f3f3f3">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, 'dirty_power', 'Dirty Power')}
            position="insideTopLeft"
            offset={LabelOffset}/>
        </Bar>
        <ReferenceArea shape={
          <ElectrificationLines
            electrificationPrcnt={electrificationPrcnt}/>}
            showLines={showLines} />
      </BarChart>
    </div>
  )
}

/**
 * A helper function that generates our electrification marker lines, which
 * draws 4 lines:
 *
 * 1. A horizontal line from the very top of the top bar (Power) going right
 * 2. A horizontal line from the bottom of the last electrification applicable
 *    bar (Transportation) going right
 * 3. A vertical line connecting the right endpoints of #1 and #2
 * 4. A horizontal line going right from the center point of #3
 */
function ElectrificationLines ({ electrificationPrcnt, showLines }) {
  if (!showLines) {
    return null;
  }

  const LineWidth = 50

  const StrokeWidth = 4
  const TopY = StrokeWidth
  const BotY = GraphHeight * (electrificationPrcnt / 100)

  const lines = [
    { x1: BarWidth, x2: BarWidth + LineWidth, y1: TopY, y2: TopY },
    { x1: BarWidth, x2: BarWidth + LineWidth, y1: BotY, y2: BotY },
    // The vertical line
    {
      x1: BarWidth + LineWidth - StrokeWidth/2,
      x2: BarWidth + LineWidth - StrokeWidth/2,
      y1: TopY,
      y2: BotY
    },
    // The right mid line
    {
      x1: BarWidth + LineWidth,
      x2: BarWidth + LineWidth * 2,
      y1: BotY / 2,
      y2: BotY / 2,
    },
  ]

  const lineColor = '#000'

  return (
    <g>
      {lines.map((line, index) => (
        <line
          key={index}
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          stroke={lineColor}
          strokeWidth={StrokeWidth} />
      ))}
    </g>
  )
}
