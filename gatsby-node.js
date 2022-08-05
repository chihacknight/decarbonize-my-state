// Based on Gatsby docs at https://www.gatsbyjs.com/docs/creating-and-modifying-pages/
const path = require("path")
const puppeteer = require('puppeteer')
const fs = require('fs')
const { siteMetadata } = require("./gatsby-config")
 
exports.createPages = async ({ graphql, actions, reporter, location }) => {
 const { createPage } = actions

 var namesForSocialCardImage = []
 var waitingForReady = true
 
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
 
 async function captureScreenshot(name) {
  waitingForReady = false;
   // if screenshots directory is not exist then create one
   if (!fs.existsSync("screenshots")) {
     fs.mkdirSync("screenshots");
   }
    let browser = null;
    try {
     // launch headless Chromium browser
     browser = await puppeteer.launch({headless: false});
      // create new page object
     const page = await browser.newPage();
      // set viewport width and height
     await page.setViewport({ width: 800, height: 418 });
     //no timeout time
     await page.setDefaultNavigationTimeout(0);

      await page.goto(siteMetadata.url+"social-card?state="+name, {waitUntil: "networkidle2"});

        // capture screenshot and store it into screenshots directory.
       await page.screenshot({ path: 'screenshots/'+name+'.jpeg' });
       await browser.close();
      waitingForReady = true;

     
   } catch (err) {
     console.log(`❌ Error: ${err.message}`);
   }
 }
 
 placeNames.forEach(name => {
   const path = name
   createPage({
     path,
     component: StateDetailsTemplate,
     context: {
       state: name
     }
   })

   namesForSocialCardImage.push(name)
 })

 setTimeout(async function() {
  for (const name of namesForSocialCardImage)
  {
    while(!waitingForReady){}
    await captureScreenshot(name);
  }
 }, 3000)
}
 

