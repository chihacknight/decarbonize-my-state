import React from "react"
import { yearsToTarget } from "../constants/climate-data"

const percentToColor = "rgb(163, 215, 164)"
const percentRemainingColor = "rgb(255, 87, 34)"
const oneYearColor = "rgb(255, 213, 128)"

/**
 * label - The actual UI label to show for the MW of generation
 * labelSlug - The prefix to use to generate IDs for elements in this graph
 */
const WindSolarBuilds = ({
  label,
  labelSlug,
  percentCurrent,
  percentRemaining,
}) => {
  const oneMoreYearPct = percentRemaining / yearsToTarget
  //otherPct
  if (percentCurrent !== 0 || percentRemaining !== 0) {
    return (
      <svg
        width={"100%"}
        height="50px"
        style={{ marginTop: "0.5em" }}
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby={`${labelSlug}-title ${labelSlug}-description`}
        role="img"
        className="already-electrified-chart"
      >
        <title id={`${labelSlug}-title`}>Percent of needed {label} built</title>
        <desc id={`${labelSlug}-description`}>
          A chart showing the share of Solar and Wind capacity that has already
          been installed and rest to be installed. We are {percentCurrent}% of
          the way to what we need to be carbon neutral by 2050.
        </desc>

        <rect
          x={0}
          y={"35%"}
          width={`${percentCurrent}%`}
          height="30%"
          fill={percentToColor}
        />
        <rect
          x={`${percentCurrent + oneMoreYearPct}%`}
          y={"35%"}
          width={`${percentRemaining - oneMoreYearPct}%`}
          height="30%"
          fill={percentRemainingColor}
        />
        <rect
          x={`${percentCurrent}%`}
          y={"35%"}
          width={`${oneMoreYearPct}%`}
          height="30%"
          fill={oneYearColor}
        />
        <text x={0} y={"25%"} alignmentBaseline="text-top">
          MWs of {label} Built: {percentCurrent.toFixed(1)}%
        </text>
        <text
          x={`${percentCurrent + 1}%`}
          y={"100%"}
          alignmentBaseline="text-top"
        >
          Needed This Year: {oneMoreYearPct.toFixed(1)}%
        </text>
      </svg>
    )
  } else {
    return null
  }
}

export default React.memo(WindSolarBuilds)
