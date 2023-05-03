/**
 * This file lops through every state and takes screenshots of the social card for each state
 * This script is only meant to be run locally
 */

const puppeteer = require("puppeteer")
const fs = require("fs")
const { placeNames } = require("./constants/state-names")
const { powerPlantUrls } = require("./constants/power-plants")

/**
 * Process command line flags to indicate we want to only generate state or power plants. Valid
 * options are:
 *
 * --states - only generate state social images
 * --power-plants - only generate power plant social images
 * --debugging - log out for each image made for progress
 * --headless - don't show the browser, even when debugging
 *
 * If neither are specified, we run through both
 */
const CommandArguments = process.argv.slice(2)

/** An index to start at generating power plants, useful when you had a partial run */
const PowerPlantStartIndex = 0

/**
 * We default to localhost (like when you're updating the social card styling) but you may want to
 * hit a Netlify preview so that your local machine isn't running `gatsby develop`, which has a bad
 * habit of eating up all available Node memory
 */
const SiteDomain = "http://localhost:8000"

/** A small delay between calls to captureScreenshot to prevent spamming */
const PauseDelayMs = 150

// Source: https://stackoverflow.com/a/41407246/2296368
const CmdColorCyan = "\x1b[36m"
const CmdColorGreen = "\x1b[32m"
const CmdColorYellow = "\x1b[33m"
const CmdColorRed = "\x1b[31m"
const CmdReset = "\x1b[0m"

let shouldGenerateStates = true
let shouldGeneratePowerPlants = true
let isDebugging = false
let useHeadless = true

// Maintain one browser instance across all screenshots for better performance and to prevent
// spamming
let browser = null

/**
 * A helper function to do a timeout with a delay
 *
 * E.g. await waitFor(500)
 */
async function waitFor(delay) {
  new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * A helper function to log in a certain color
 */
function consoleLogColor(cmdColorConst, msg) {
  console.log(cmdColorConst, msg, CmdReset)
}

function debugLog(msg) {
  if (isDebugging) {
    console.log(msg)
  }
}

async function generatePowerPlantSocialCards() {
  // Map the URL (e.g. 'https://decarbmystate.com/illinois/power-plant/will-county') to the state
  // slug and power plant slug
  const plantSlugsArr = powerPlantUrls
    .trim()
    .split("\n")
    .sort() // sort alphabetically for easier tracking
    .map(url => {
      const afterDomainSegments = url.split(".com/")[1].split("/")

      return {
        stateSlug: afterDomainSegments[0],
        powerPlantSlug: afterDomainSegments[2],
      }
    })
    .slice(PowerPlantStartIndex)

  let index = 0

  const BaseOutputDir = "./power-plant-social-out"
  const OutputFolderMain = `${BaseOutputDir}/social-cards/power-plants/`

  // If the main output folder doesn't exist, make it custom
  if (!fs.existsSync(OutputFolderMain)) {
    fs.mkdirSync(BaseOutputDir)
    fs.mkdirSync(`${BaseOutputDir}/social-cards`)
    fs.mkdirSync(`${BaseOutputDir}/social-cards/power-plants`)
  }

  for await (const plantSlugs of plantSlugsArr) {
    const powerPlantSlug = plantSlugs.powerPlantSlug
    const stateSlug = plantSlugs.stateSlug

    debugLog(
      `Start fetching screenshot for ${stateSlug} - ${powerPlantSlug} ` +
        `(${index}/${plantSlugsArr.length}, real index ${index +
          PowerPlantStartIndex})`
    )

    const url = `/power-plant-social-card/?state=${stateSlug}&plant=${powerPlantSlug}`

    // We make so many power plant images that we can't make them in /static directly while running
    // gatsby develop. Why? Because gastby develop rebuilds after _every_ file change in /static, so
    // it would rebuild thousands of times
    const outputFolder = `${OutputFolderMain}${stateSlug}`
    const filename = powerPlantSlug

    try {
      await captureScreenshot(outputFolder, url, filename)
    } catch (error) {
      consoleLogColor(CmdColorRed, "Error! Stopped screenshotting, error:")
      consoleLogColor(CmdColorRed, error)
      // If we hit an error capturing a screenshot, stop running
      break
    }

    // Delay an extra bit in case a page errors so we don't just start spamming captureScreenshot
    await waitFor(PauseDelayMs)

    debugLog(`Done for ${plantSlugs.powerPlantSlug}`)
    index++
  }
}

async function generateStateSocialCards() {
  for await (const stateSlug of placeNames) {
    debugLog(`Start fetching screenshot for ${stateSlug}`)

    const url = `/social-card?state=${stateSlug}`
    const filename = stateSlug

    try {
      await captureScreenshot("static/social-cards", url, filename)
    } catch (error) {
      consoleLogColor(CmdColorRed, "Error! Stopped screenshotting, error:")
      consoleLogColor(CmdColorRed, error)

      // If we hit an error capturing a screenshot, stop running
      break
    }

    // Delay an extra bit in case a page errors so we don't just start spamming captureScreenshot
    await waitFor(PauseDelayMs)

    debugLog(`Done for ${stateSlug}`)
  }
}

/*
 * For a given URL, capture a screenshot and output it to outputDir with the filename
 *
 * NOTE! Make sure to call browser.close()
 */
async function captureScreenshot(outputDir, url, fileName) {
  // if screenshots directory is not exist then create one
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  try {
    if (!browser) {
      // launch Chromium browser, headless if not debugging, visible fi debugging
      browser = await puppeteer.launch({ headless: useHeadless })
    }

    // create new page object
    const page = await browser.newPage()
    // set viewport width and height
    await page.setViewport({ width: 800, height: 418 })

    // 5 second timeout, since social cards should load very quickly
    page.setDefaultNavigationTimeout(5000)

    //direct puppeteer to the social-card page for each state
    await page.goto(SiteDomain + url, {
      waitUntil: "networkidle2",
    })

    // capture screenshot and store it into static/social-cards directory.
    await page.screenshot({ path: `${outputDir}/${fileName}.jpg` })

    await page.close() // close the PAGE (but not the browser) after the screenshot
  } catch (error) {
    consoleLogColor(
      CmdColorRed,
      `Error in captureScreenshot!\n${error.message}`
    )

    // Re-throw the error so we stop looping
    throw error
  }
}

async function main() {
  if (CommandArguments[0] === "--states") {
    shouldGeneratePowerPlants = false
    consoleLogColor(CmdColorYellow, "Generating ONLY state social cards...")
  } else if (CommandArguments[0] === "--power-plants") {
    shouldGenerateStates = false
    consoleLogColor(
      CmdColorYellow,
      "Generating ONLY power plant social cards..."
    )
  } else {
    consoleLogColor(CmdColorYellow, "Generating ALL social cards...")
  }

  // Enable debug logs if debugging
  if (CommandArguments.includes("--debugging")) {
    isDebugging = true
    useHeadless = false
  }

  if (CommandArguments.includes("--headless")) {
    useHeadless = true
  }

  // Start with states, since there's only 50
  if (shouldGenerateStates) {
    consoleLogColor(CmdColorCyan, "Start generating state social cards...")

    try {
      await generateStateSocialCards()
    } catch (error) {
      consoleLogColor(CmdColorRed, error)
    }

    consoleLogColor(CmdColorGreen, "Done generating state social cards!")
  }
  // Move on power plants
  if (shouldGeneratePowerPlants) {
    consoleLogColor(
      CmdColorCyan,
      "Start generating power plant social cards..."
    )

    await generatePowerPlantSocialCards()

    consoleLogColor(CmdColorGreen, "Done generating power plant social cards!")
  }

  // Close the browser if exists
  if (browser) {
    try {
      await browser.close()
    } catch {
      /* do nothing */
    }
  }
}

// Run the main function
main()
