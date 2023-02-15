import React from "react"
import { yearsToTarget } from "../constants/climate-data"

const electrifiedColor = "rgb(110, 191, 112)"
const fossilColor = "rgb(254, 140, 75)"
const oneYearColor = "rgb(255, 213, 128)"

const AlreadyElectrifiedChart = ({ label, electrifiedPct, fossilPct }) => {
  const oneMoreYearPct = fossilPct / yearsToTarget
  //otherPct
  if (electrifiedPct !== 0 || fossilPct !== 0) {
    return (
      <svg
        width={"100%"}
        height="60px"
        style={{ marginTop: "0.5em" }}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <title id={`${label}-title`}>Percent of {label} electrified</title>
        <desc id={`${label}-description`}>
          A chart showing the share of {label} that have already been
          electrified and still based in fossil fuel.
          {electrifiedPct}% have been electrified, and the remaining {fossilPct}
          % are fossil fuel based.
        </desc>

        <rect
          x={0}
          y={"35%"}
          width={`${electrifiedPct}%`}
          height="30%"
          fill={electrifiedColor}
        />
        <rect
          x={`${electrifiedPct + oneMoreYearPct}%`}
          y={"35%"}
          width={`${fossilPct - oneMoreYearPct}%`}
          height="30%"
          fill={fossilColor}
        />

        <rect
          x={`${electrifiedPct}%`}
          y={"35%"}
          width={`${oneMoreYearPct}%`}
          height="30%"
          fill={oneYearColor}
        />

        <text
          x={0}
          y={"20%"}
          fontSize="0.9rem"
          fontWeight="bold"
          alignmentBaseline="text-top"
        >
          {label} Electrified: {electrifiedPct.toFixed(1)}%
        </text>

        <text
          x={`${electrifiedPct}%`}
          y={"95%"}
          fontSize="0.9rem"
          fontWeight="bold"
          alignmentBaseline="text-top"
        >
          Needed This Year: {oneMoreYearPct.toFixed(1)}%
        </text>

        <text
          x={"100%"}
          y={"20%"}
          fontSize="0.9rem"
          fontWeight="bold"
          textAnchor="end"
          alignmentBaseline="text-top"
        >
          Not Electrified: {(fossilPct - oneMoreYearPct).toFixed(1)}%
        </text>

        {/* <text x={"0%"} y={"95%"} fontSize="0.7rem" alignmentBaseline="text-top">
          Middle Section Indicates Progress Needed This Year
        </text> */}
      </svg>
    )
  } else {
    return null
  }
}

export default React.memo(AlreadyElectrifiedChart)
