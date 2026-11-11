import React from "react"

import {
  EmissionsCategories,
  ActiveCategoryFill,
} from "../constants/emissions-categories"

/** Below this share a segment shows only its emoji, then nothing at all */
const MinPrcntForPrcntLabel = 12
const MinPrcntForEmoji = 5

/**
 * A horizontal version of the sticky SingleBarChart for mobile and tablet,
 * shown in the state page's sticky header. Each segment is a section sized by
 * its share of emissions, colored the same way: orange for the section you're
 * on and green for sections already covered. Segments link to their section.
 * The current section's name is written out below, since a narrow segment
 * only has room for an emoji.
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
          ({ sectionId, key, emoji, name, fill, greenFill }) => {
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
                {prcnt >= MinPrcntForEmoji && (
                  <span className={`emoji -${sectionId}`} aria-hidden="true">
                    {emoji}
                  </span>
                )}
                {prcnt >= MinPrcntForPrcntLabel && (
                  <span aria-hidden="true">{prcnt}%</span>
                )}
              </a>
            )
          }
        )}
      </div>
      {currentSection && (
        <div className="section-progress-label" aria-hidden="true">
          <span className={`emoji -${currentSection.sectionId}`}>
            {currentSection.emoji}
          </span>
          <span>{currentSection.name}</span>
          <span className="section-progress-prcnt">
            {Number(percents[currentSection.key])}%
          </span>
        </div>
      )}
    </nav>
  )
}
