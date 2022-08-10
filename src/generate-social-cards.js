const puppeteer = require("puppeteer");
const fs = require("fs");

var waitingForReady = true;

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
];

async function captureScreenshot(name) {
  let browser = null;
  waitingForReady = false;
  let outputDir = "static/social-cards";
  // if screenshots directory is not exist then create one
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  try {
    // launch headless Chromium browser
    browser = await puppeteer.launch({ headless: false });
    // create new page object
    const page = await browser.newPage();
    // set viewport width and height
    await page.setViewport({ width: 800, height: 418 });
    //no timeout time
    page.setDefaultNavigationTimeout(0);
    await page.goto("http://localhost:8000/social-card?state=" + name, {
      waitUntil: "networkidle2",
    });

    // capture screenshot and store it into screenshots directory.
    await page.screenshot({ path: outputDir + "/" + name + ".jpg" });
    await browser.close();
    waitingForReady = true;
  } catch (err) {
    console.log(`❌ Error: ${err.message}`);
  }
}

setTimeout(async function() {
  for (const name of placeNames) {
    while (!waitingForReady) {
      setTimeout(async function() {}, 1000);
    }
    await captureScreenshot(name);
  }
}, 3000);
