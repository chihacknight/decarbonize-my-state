import React from "react"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import QuestionIcon from "../images/icons/question-circle.svg"

/**
 * A ? icon that shows a tooltip on hover or focus. `ariaLabel` is what screen
 * readers announce, so it should contain the full tooltip text. Pass `wide`
 * for a few sentences, which would make the default narrow tooltip very tall.
 */
export default function InfoHover({ ariaLabel, wide = false, children }) {
  const renderTooltip = props => (
    <Tooltip
      id="button-tooltip"
      {...props}
      className={wide ? "info-hover-wide" : props.className}
    >
      {children}
    </Tooltip>
  )

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      <sup
        tabIndex="0"
        role="tooltip"
        className="terminology-icon"
        aria-label={ariaLabel}
      >
        <img src={QuestionIcon} alt="" />
      </sup>
    </OverlayTrigger>
  )
}
