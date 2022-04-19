// Based on Gatsby docs at https://www.gatsbyjs.com/docs/creating-and-modifying-pages/
const path = require("path")

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const placeNames = [
    "alabama",
    "alaska",
    "arizona",
    "arkansas",
    "california",
    "colorado",
    "connecticut",
    "delaware",
    "district_of_columbia",
    "florida",
    "georgia",
    "hawaii",
    "idaho",
    "illinois",
    "indiana",
    "iowa",
    "kansas",
    "kentucky",
    "louisiana",
    "maine",
    "maryland",
    "massachusetts",
    "michigan",
    "minnesota",
    "mississippi",
    "missouri",
    "montana",
    "nebraska",
    "nevada",
    "new_hampshire",
    "new_jersey",
    "new_mexico",
    "new_york",
    "north_carolina",
    "north_dakota",
    "ohio",
    "oklahoma",
    "oregon",
    "pennsylvania",
    "rhode_island",
    "south_carolina",
    "south_dakota",
    "tennessee",
    "texas",
    "utah",
    "vermont",
    "virginia",
    "washington",
    "west_virginia",
    "wisconsin",
    "wyoming"
  ]

  const StateDetailsTemplate = path.resolve(`src/components/state-details.js`)
  placeNames.forEach(name => {
    const path = name

    createPage({
      path,
      component: StateDetailsTemplate,
      context: {
        state: name
      }
    })
  })
}
