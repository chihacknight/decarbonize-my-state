/**
 * This file lops through every state and takes screenshots of the social card for each state
 * This script is only meant to be run locally
 */

const puppeteer = require("puppeteer")
const fs = require("fs")
const { placeNames } = require("./constants/state-names")
const { powerPlantUrls } = require("./constants/power-plants")

const SocialPageDelayMS = 3000
const WaitDelayMS = 500

/**
 * Process command line flags to indicate we want to only generate state or power plants. Valid
 * options are:
 *
 * --states - only generate state social images
 * --power-plants - only generate power plant social images
 *
 * If neither are specified, we run through both
 */
const CommandArguments = process.argv.slice(2)

let shouldGenerateStates = true
let shouldGeneratePowerPlants = true
let isDebugging = false

// Source: https://stackoverflow.com/a/41407246/2296368
const CmdColorCyan = "\x1b[36m"
const CmdColorGreen = "\x1b[32m"
const CmdColorRed = "\x1b[31m"
const CmdReset = "\x1b[0m"

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
  // Map the URL (e.g. 'https://decarbmystate.com/illinois/power-plant/will-county')
  const plantSlugsArr = powerPlantUrls
    .trim()
    .split("\n")
    .map(url => {
      const afterDomainSegments = url.split(".com/")[1].split("/")

      return {
        stateSlug: afterDomainSegments[0],
        powerPlantSlug: afterDomainSegments[2],
      }
    })

  let index = 0;

  for await (const plantSlugs of plantSlugsArr) {
    debugLog(`Starting for ${plantSlugs.powerPlantSlug} ` +
      `(${index}/${plantSlugsArr.length})`);

    const powerPlantSlug = plantSlugs.powerPlantSlug
    const stateSlug = plantSlugs.stateSlug

    const url = `/power-plant-social-card/?state=${stateSlug}&plant=${powerPlantSlug}`
    const outputFolder = `static/social-cards/power-plants/${stateSlug}`
    const filename = powerPlantSlug

    await captureScreenshot(outputFolder, url, filename)
    debugLog(`Done for ${plantSlugs.powerPlantSlug}`)
    index++;
  }
}

async function generateStateSocialCards() {
  // wait for the previous state to finish taking screenshot before making the next one
  await waitFor(SocialPageDelayMS)

  for await (const stateSlug of placeNames) {
    debugLog(`Starting for ${stateSlug}`)

    const url = `/social-card?state=${stateSlug}`
    const filename = stateSlug

    await captureScreenshot("static/social-cards", url, filename)

    debugLog(`Done for ${stateSlug}`)
  }
}

/*
 * For each state, use puppeteer to capture a screenshot

 * @param name {string} the name of the state to have the social-card taken a picture of
 */
async function captureScreenshot(outputDir, url, fileName) {
  let browser = null

  // if screenshots directory is not exist then create one
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }

  try {
    // launch headless Chromium browser
    browser = await puppeteer.launch({ headless: false })
    // create new page object
    const page = await browser.newPage()
    // set viewport width and height
    await page.setViewport({ width: 800, height: 418 })

    //no timeout time in case it takes a page a long time to load
    page.setDefaultNavigationTimeout(0)

    //direct puppeteer to the social-card page for each state
    await page.goto("http://localhost:8000" + url, {
      waitUntil: "networkidle2",
    })

    // capture screenshot and store it into static/social-cards directory.
    await page.screenshot({ path: `${outputDir}/${fileName}.jpg` })
    await browser.close()
  } catch (err) {
    console.log(`❌Error: ${err.message}`)
  }
}

async function main() {
  if (CommandArguments[0] === "--states") {
    shouldGeneratePowerPlants = false
    consoleLogColor(CmdColorCyan, "Generating ONLY state social cards...")
  } else if (CommandArguments[0] === "--power-plants") {
    shouldGenerateStates = false
    consoleLogColor(CmdColorCyan, "Generating ONLY power plant social cards...")
  } else {
    consoleLogColor(CmdColorCyan, "Generating ALL social cards...")
  }

  // Enable debug logs if debugging
  if (CommandArguments.includes("--debugging")) {
    isDebugging = true
  }

  // Start with states, since there's only 50
  if (shouldGenerateStates) {
    consoleLogColor(CmdColorCyan, "Start generating state social cards...")

    await generateStateSocialCards()

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
}

// Run the main function
main()
