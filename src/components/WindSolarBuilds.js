import React from 'react'

const percentToColor = "rgb(163, 215, 164)"
const percentRemainingColor = "rgb(255, 87, 34)"
const WindSolarBuilds = ({ label, percentCurrent, percentRemaining }) => { //otherPct
  if (percentCurrent !== 0 || percentRemaining !== 0) {
    return (
      <svg
        width={"100%"}
        height="50px"
        style={{marginTop:'0.5em'}}
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby={`${label}-title ${label}-description`}
        role="img"
      >
        <title id={`${label}-title`}>Percent of needed {label} built</title>
        <desc id={`${label}-description`}>
          A chart showing the share of Solar and Wind capacity that has already been installed and rest to be installed.
          We are {percentCurrent}% of the way to what we need to be carbon neutral by 2050.
        </desc>
        
        <rect x={0} y={'70%'} width={`${percentCurrent}%`} height="30%" fill={percentToColor} />
        <rect x={`${percentCurrent}%`} y={'70%'} width={`${percentRemaining}%`} height="30%" fill={percentRemainingColor} />
        <text x={0} y={'40%'} fontSize="0.9rem" fontWeight="bold" alignmentBaseline='text-top'>MWs of {label} Built</text>
      </svg>
    )
  } else {
    return null
  }
}

export default React.memo(WindSolarBuilds)