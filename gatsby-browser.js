/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import "react-bootstrap-typeahead/css/Typeahead.css"

/**
 * The scroll position Gatsby saved for a history entry, or 0. Its own
 * getSavedScrollPosition (passed to shouldUpdateScroll) leaves out the entry's
 * key, so never finds one in this version. Same storage as
 * gatsby-react-router-scroll's SessionStorage
 */
const getSavedScrollY = ({ pathname, key }) => {
  try {
    const value = window.sessionStorage.getItem(`@@scroll|${pathname}|${key}`)
    return value ? JSON.parse(value) : 0
  } catch (e) {
    return 0
  }
}

/**
 * Scroll handling on navigation. State pages scroll smoothly for in-page links
 * (CSS scroll-behavior in state-details.css), so:
 *
 * - In-page links (only the hash changes) are left to the browser, so they
 *   scroll smoothly. Gatsby would otherwise scroll to the current position,
 *   cancelling it
 * - Moving to another page jumps straight to its saved position (going back
 *   or forward), its hash's section, or the top, rather than smooth scrolling
 *   there from wherever the last page was scrolled to
 */
export const shouldUpdateScroll = ({
  prevRouterProps,
  routerProps: { location },
}) => {
  const prevPath = prevRouterProps && prevRouterProps.location.pathname
  if (prevPath === location.pathname) {
    return false
  }

  const savedY = getSavedScrollY(location)
  const hashTarget =
    location.hash && document.getElementById(location.hash.slice(1))
  if (!savedY && hashTarget) {
    hashTarget.scrollIntoView({ behavior: "instant" })
  } else {
    window.scrollTo({ top: savedY, behavior: "instant" })
  }
  return false
}
