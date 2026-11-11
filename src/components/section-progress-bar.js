import React from "react"

import {
  EmissionsCategories,
  ActiveCategoryFill,
} from "../constants/emissions-categories"

/** Segments below this share are too narrow for their icon */
const MinPrcntForIcon = 5

/**
 * A section's single-color icon, drawn as a mask so it takes the text color,
 * or its emoji when given no icon. The bar uses icons, which read better at
 * its small size, and the label below uses the more detailed emoji
 */
const SectionIcon = ({ sectionId, emoji, icon }) =>
  icon ? (
    <span
      className="section-icon"
      style={{ "--icon": `url(${icon})` }}
      aria-hidden="true"
    />
  ) : (
    <span className={`emoji -${sectionId}`} aria-hidden="true">
      {emoji}
    </span>
  )

/**
 * A horizontal version of the sticky SingleBarChart for mobile and tablet,
 * shown in the state page's sticky header. Each segment is a section sized by
 * its share of emissions, colored the same way: orange for the section you're
 * on and green for sections already covered. Segments link to their section.
 * Segments show just their emoji, and the current section's name and share
 * are written out below.
 *
 * @param percents   Emissions % for each emissions key, as numbers or strings
 * @param activeKey  The emissions key of the section you're on
 * @param greenKeys  Emissions keys of sections already scrolled past
 */
export default function SectionProgressBar({ percents, activeKey, greenKeys }) {
  const shownSections = Object.values(EmissionsCategories).filter(
    ({ key }) => Number(percents[key]) > 0
  )

  // Between sections (on a section's wrap up) nothing is active, so keep
  // naming the section just covered
  const currentSection =
    shownSections.find(({ key }) => key === activeKey) ||
    [...shownSections].reverse().find(({ key }) => greenKeys.includes(key))

  return (
    <nav className="section-progress" aria-label="Page sections">
      <div className="section-progress-bar">
        {shownSections.map(
          ({ sectionId, key, emoji, icon, name, fill, greenFill }) => {
            const prcnt = Number(percents[key])
            const isActive = key === activeKey

            let background = fill
            if (isActive) {
              background = ActiveCategoryFill
            } else if (greenKeys.includes(key)) {
              background = greenFill
            }

            return (
              <a
                key={key}
                href={`#${sectionId}`}
                className={isActive ? "-active" : ""}
                style={{ flexGrow: prcnt, background }}
                title={`${name}: ${prcnt}%`}
                aria-label={`${name}: ${prcnt}%`}
                aria-current={isActive ? "location" : undefined}
              >
                {prcnt >= MinPrcntForIcon && (
                  <SectionIcon
                    sectionId={sectionId}
                    emoji={emoji}
                    icon={icon}
                  />
                )}
              </a>
            )
          }
        )}
      </div>
      {/* Every section's label, stacked, so CSS can fade between them */}
      <div className="section-progress-labels" aria-hidden="true">
        {shownSections.map(({ sectionId, key, emoji, name }) => (
          <div
            key={key}
            className={
              "section-progress-label" +
              (currentSection && currentSection.key === key ? " -current" : "")
            }
          >
            <SectionIcon sectionId={sectionId} emoji={emoji} />
            <span>{name}</span>
            <span className="section-progress-prcnt">
              {Number(percents[key])}%
            </span>
          </div>
        ))}
      </div>
    </nav>
  )
}
