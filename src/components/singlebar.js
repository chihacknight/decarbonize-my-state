import React from "react"
import { BarChart, Bar, LabelList, ReferenceArea, YAxis } from "recharts"

/* Calculate a rounded percentage given a value and the total it's out of */
const getPct = (value, total) => { return Math.round((value/total)*100) }

/** Create the label text with the percentage */
const getLabel = (entry, total, field, label) => {
  return `${label}: ${getPct(entry[field], total)}%`
}

/**
 * Create constants for bar and graph dimensions for calculating lines
 */
let BarWidth
let GraphWidth
let GraphHeight

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
 * @param {boolean} homeView Whether this is the homepage bar graph, which
 * is showing US emissions breakdown (which never has, say 1% for buildings) and
 * should show the electrification highlight lines to show what share of
 * emissions can be handled by Clean Electrification
 *
 * @param {string} activeKey An optional key
 */
export default function SingleBarChart ({ emissionsData, homeView, activeKeys }) {
  // sum all emissions fields except year
  const emissionsTotal = Object.entries(emissionsData)
    .filter(([key,_val]) => key !== 'year')
    .reduce((acc, [_key,val]) => acc + val, 0)

  // To draw our lines we need to know the % of emissions that are handled by
  // clean electrification. We do this by finding the non-electrifiable percent
  // and then doing an inverse
  const nonElectrificationPrcnt = getPct(emissionsData.dumps_farms_industrial_other, emissionsTotal)
  const electrificationPrcnt = 100 * (1 - (nonElectrificationPrcnt / 100))

  /**
   * Configuration for the colors for each bar graph bar as well as their data
   * key and label text
   */
  const BarsConfig = {
    other: {
      key: 'dumps_farms_industrial_other',
      text: 'Farms, Industrial & Other',
      fill: '#98886c',
      // This categoy cannot be electrified so make the activeFill red to be
      // clearly bad
      activeFill: '#cabd98',
    },
    transport: {
      key: 'transportation',
      text: 'Transportation',
      fill: '#a6a6a6',
      activeFill: '#4caf50',
    },
    buildings: {
      key: 'buildings',
      text: 'Buildings',
      fill: '#c2c2c2',
      activeFill: '#6ebf70',
    },
    power: {
      key: 'dirty_power',
      text: 'Dirty Power',
      fill: '#dcdcdc',
      activeFill: '#a3d7a4',
    }
  }

  const LabelOffset = 12
  let LabelPosition = 'right'
  let GraphMargin = {
    top: 0,
    right: 200,
    left: 0,
    bottom: 0
  };

  BarWidth = 150
  GraphWidth = 400
  GraphHeight = 350

  if (homeView) {
    LabelPosition = 'insideTopLeft'
    BarWidth = 275
    GraphWidth = 375
    GraphMargin = {
      top: 0,
      right: 100,
      left: 0,
      bottom: 0
    };
  }

  // If on state details, shorten text labels
  if (!homeView) {
    BarsConfig.power.text = 'Power';
    BarsConfig.transport.text = 'Transport';
    BarsConfig.other.text = 'Other';
  }

  if (activeKeys) {
    Object.values(BarsConfig).forEach(config => {
      if (activeKeys.includes(config.key)) {
        config.fill = config.activeFill
      }
    })
  }

  return (
    <div className="single-bar-chart">
      <BarChart
        barSize={ BarWidth }
        width={ GraphWidth }
        height={ GraphHeight}
        data={[emissionsData]}
        margin={ GraphMargin }
      >
        { /* Make sure the y-axis matches the data exactly so the bars take up 100% of the height */ }
        <YAxis domain={['dataMin', 'dataMax']} hide={ true } />
        <Bar dataKey={ BarsConfig.other.key }
          fill={ BarsConfig.other.fill }
          stackId="main">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, BarsConfig.other.key, BarsConfig.other.text)}
            position={LabelPosition}
            offset={LabelOffset}/>
        </Bar>
        <Bar dataKey={ BarsConfig.transport.key }
          fill={ BarsConfig.transport.fill }
          stackId="main">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, BarsConfig.transport.key, BarsConfig.transport.text)}
            position={LabelPosition}
            offset={LabelOffset}/>
        </Bar>
        <Bar dataKey={ BarsConfig.buildings.key }
          fill={ BarsConfig.buildings.fill }
          stackId="main">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, BarsConfig.buildings.key, BarsConfig.buildings.text)}
            position={LabelPosition}
            offset={LabelOffset}/>
        </Bar>
        <Bar dataKey={ BarsConfig.power.key }
          fill={ BarsConfig.power.fill }
          stackId="main">
          <LabelList
            valueAccessor={entry =>
              getLabel(entry, emissionsTotal, BarsConfig.power.key, BarsConfig.power.text)}
            position={LabelPosition}
            offset={LabelOffset}/>
        </Bar>
        <ReferenceArea shape={
          <ElectrificationLines
            electrificationPrcnt={electrificationPrcnt}/>}
        homeView={homeView} />
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
function ElectrificationLines ({ electrificationPrcnt, homeView }) {
  if (!homeView) {
    return null
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
