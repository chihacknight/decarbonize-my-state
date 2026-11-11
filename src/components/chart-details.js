import React, { useState } from "react"

/**
 * A chart collapsed into a panel, for extra detail people can open if they
 * want it. `label` is the call to action on the panel's header (like "View EV
 * growth trends"), and `title` and `note` head the chart once it's open.
 *
 * The chart only renders once opened, since charts sized to their container
 * can't measure it while it's hidden
 */
const ChartDetails = ({ label, title, note, className = "", children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <details
      className={`chart-details ${className}`}
      onToggle={event => setIsOpen(event.currentTarget.open)}
    >
      {/* A span so the label can be spaced from the arrow, which doesn't take
          margins */}
      <summary>
        <span className="chart-details-label">{label}</span>
      </summary>
      {isOpen && (
        <div className="chart-details-body">
          <h3 className="chart-title">{title}</h3>
          {note && <div className="chart-note">{note}</div>}
          {children}
        </div>
      )}
    </details>
  )
}

export default ChartDetails
