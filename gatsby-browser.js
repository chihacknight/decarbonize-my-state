/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import "react-bootstrap-typeahead/css/Typeahead.css"

/**
 * Leave in-page links (only the hash changes) to the browser, so they follow
 * the page's CSS scroll-behavior. Otherwise Gatsby scrolls to the current
 * position on every location change, which cancels smooth scrolling
 */
export const shouldUpdateScroll = ({ prevRouterProps, routerProps }) => {
  const prevPath = prevRouterProps && prevRouterProps.location.pathname
  return prevPath !== routerProps.location.pathname
}
