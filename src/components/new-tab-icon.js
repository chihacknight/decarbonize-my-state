import React from "react"

import NewTabImg from "../images/icons/new-tab.svg"
import NewTabWhiteImg from "../images/icons/new-tab-white.svg"

/**
 * Sow a new tab icon for links, with optional classes (e.g. '-white', which
 * switches to the white icon)
 */
const NewTabIcon = ({ text, classes }) => {
  let combinedClasses = "new-tab-icon"
  combinedClasses = classes ? `${combinedClasses} ${classes}` : combinedClasses

  return (
    <>
      <span className="text-nowrap">
        &nbsp;
        <img
          src={classes === "-white" ? NewTabWhiteImg : NewTabImg}
          alt="(opens in a new tab)"
          className={combinedClasses}
        />
      </span>
    </>
  )
}

export default NewTabIcon
