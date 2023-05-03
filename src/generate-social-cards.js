/**
 * This file lops through every state and takes screenshots of the social card for each state
 * This script is only meant to be run locally
 */

const puppeteer = require("puppeteer")
const fs = require("fs")
const { placeNames } = require("./constants/state-names")

var waitingForReady = true
const SocialPageDelayMS = 3000
const WaitDelayMS = 1000

/*
 * For each state, use puppeteer to capture a screnshot
 * @param name {string} the name of the state to have the social-card taken a picture of
 */
async function captureScreenshot(name) {
  let browser = null
  waitingForReady = false
  let outputDir = "static/social-cards"

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
    await page.goto("http://localhost:8000/social-card?state=" + name, {
      waitUntil: "networkidle2",
    })

    // capture screenshot and store it into static/social-cards directory.
    await page.screenshot({ path: outputDir + "/" + name + ".jpg" })
    await browser.close()
    waitingForReady = true
  } catch (err) {
    console.log(`❌Error: ${err.message}`)
  }
}

//wait for the previous state to finish taking screenshot before making the next one
setTimeout(async function() {
  for (const name of placeNames) {
    while (!waitingForReady) {
      setTimeout(function() {}, WaitDelayMS)
    }

    await captureScreenshot(name)
  }
}, SocialPageDelayMS)
