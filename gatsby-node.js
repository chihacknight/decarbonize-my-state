// Based on Gatsby docs at https://www.gatsbyjs.com/docs/creating-and-modifying-pages/
const path = require("path")
const { siteMetadata } = require("./gatsby-config")

exports.createPages = async ({ graphql, actions, reporter, location }) => {
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
    "wyoming",
  ]

  const StateDetailsTemplate = path.resolve(`src/components/state-details.js`)

  placeNames.forEach(name => {
    const path = name
    createPage({
      path,
      component: StateDetailsTemplate,
      context: {
        state: name,
      },
    })
  })

  const result = await graphql(
    `
      query MyQuery {
        allPowerPlantsJson {
          edges {
            node {
              power_plants {
                slug
              }
              state
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  /**
   * Setup Power Plant Routes for Each Power Plant
   */
  const PowerPlantDetailTemplate = path.resolve(
    `src/components/power-plant-detail.js`
  )

  const powerPlantStates = result.data.allPowerPlantsJson.edges

  powerPlantStates.forEach(stateEdge => {
    let allPlants = stateEdge.node.power_plants
    const state = stateEdge.node.state

    allPlants.forEach(powerPlant => {
      currSlug = powerPlant.slug
      const path = `${state}/power-plant/${currSlug}`

      createPage({
        path,
        component: PowerPlantDetailTemplate,
        context: {
          powerPlantSlug: currSlug,
        },
      })
    })
  })
}
