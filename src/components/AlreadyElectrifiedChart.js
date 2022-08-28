import React from "react";

const electrifiedColor = "rgb(163, 215, 164)";
const fossilColor = "rgb(255, 87, 34)";
const AlreadyElectrifiedChart = ({ label, electrifiedPct, fossilPct }) => {
  //otherPct
  if (electrifiedPct !== 0 || fossilPct !== 0) {
    return (
      <svg
        width={"100%"}
        height="50px"
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
          y={"70%"}
          width={`${electrifiedPct}%`}
          height="30%"
          fill={electrifiedColor}
        />
        <rect
          x={`${electrifiedPct}%`}
          y={"70%"}
          width={`${fossilPct}%`}
          height="30%"
          fill={fossilColor}
        />
        <text
          x={0}
          y={"40%"}
          fontSize="0.9rem"
          fontWeight="bold"
          alignmentBaseline="text-top"
        >
          {label} Electrified
        </text>
        <text
          x={"100%"}
          y={"40%"}
          fontSize="0.9rem"
          fontWeight="bold"
          textAnchor="end"
          alignmentBaseline="text-top"
        >
          Not yet
        </text>
      </svg>
    );
  } else {
    return null;
  }
};

export default React.memo(AlreadyElectrifiedChart);
