// Based on Gatsby docs at https://www.gatsbyjs.com/docs/creating-and-modifying-pages/
const path = require("path")
const puppeteer = require('puppeteer')
const fs = require('fs')
 
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
 
 async function captureScreenshot(name) {
   // if screenshots directory is not exist then create one
   if (!fs.existsSync("screenshots")) {
     fs.mkdirSync("screenshots");
   }
    let browser = null;
    try {
     // launch headless Chromium browser
     browser = await puppeteer.launch({headless: false});
     console.log('launched puppteer')
      // create new page object
     const page = await browser.newPage();
     console.log('new page')
      // set viewport width and height
     await page.setViewport({ width: 800, height: 418 });
     console.log('se viewport')

     //no timeout time
     await page.setDefaultNavigationTimeout(0);

    await page.goto("http://localhost:8000/social-card?state=illinois");
    console.log('go to link')
      // capture screenshot and store it into screenshots directory.
     await page.screenshot({ path: 'screenshots/illinois.jpeg' });
     console.log('took screenshot')
   } catch (err) {
     console.log(`❌ Error: ${err.message}`);
   } finally {
     await browser.close();
     console.log(`\n🎉 GitHub profile screenshots captured.`);
   }
 }
 
 placeNames.forEach(name => {
   const path = name
 
   // const Screenshot = async () => {
   //   const browser = await puppeteer.launch();
   //   const page = await browser.newPage();
   //   await page.goto('localhost:8000/social-card?state='+name);
   //   await viewElement.screenshot({path: name+'.png'});
   //   await browser.close();
   // }
   if (name === 'illinois')
   {
     captureScreenshot(name);
   }
 
   createPage({
     path,
     component: StateDetailsTemplate,
     context: {
       state: name
     }
   })
 })
}
 

