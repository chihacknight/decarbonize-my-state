import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SingleBarChart from "../components/singlebar"
import { getLatestUsData } from "../components/getLatestEmissions"

const getCleanData = (data) => {
  let mutableDataObj = {}
  for (let i=0; i<data.allEmissionsJson.edges.length;i++) {
    const stateName = data.allEmissionsJson.edges[i].node.state
    mutableDataObj[stateName] = {
      emissionsByYear: data.allEmissionsJson.edges[i].node.emissionsByYear,
    }
    // pattern for pulling other data, for future reference!
    // const buildingsData = data.allBuildingsJson.edges.find(row => row.node.state === stateName);
    // if (buildingsData) {
    //   mutableDataObj[stateName] = {
    //     ...mutableDataObj[stateName],
    //     ...buildingsData.node
    //   }
    // }
  }
  return mutableDataObj
}

const AboutPage = ({data}) => {

  const cleanData = getCleanData(data)
  // Prep data for the SingleBarChart breaking down emissions by category
  console.log(cleanData)
  const barChartData = getLatestUsData(cleanData)[0]


  return (
    <Layout>
      <SEO title="About :: Decarbonize My State" />
      <div className="container">
        <div>
          <h1 id="main border-bottom" className="py-4">About Decarb My State</h1>
          <p>Tired of waiting for Congress to act on the climate crisis? Then, <strong>decarbonize your state</strong>.</p>
          <p>Decarb My State allows Americans to picture exactly <strong>where</strong> their state’s carbon pollution comes from, and <strong>how</strong> to eliminate it.</p>

          <h2 className="pt-3">Ok then, how do we end climate pollution?</h2>
          
          <p>Decarbonization is <strong>simple</strong>—in every state, we can eliminate most emissions using <strong>clean electrification</strong>:</p> 
          <ol>
            <li>We <strong>electrify</strong> the fossil fuel machines we use to heat our homes, cook our food, and get around.</li>
            <li>We <strong>clean</strong> all our electricity, mostly by building wind and solar. (And we need to <strong>double</strong> the electricity we produce today, to power our new electric machines.)</li>
          </ol>

          <div className="electrication-cont d-flex justify-content-center my-3">
            {/* Desktop only graph */}
            <div className="d-none d-md-block">
              <SingleBarChart emissionsData={barChartData} homeView={true} />
            </div>
            {/* Mobile only graph */}
            <div className="d-md-none">
              <SingleBarChart emissionsData={barChartData} homeView={true} mobileView={true} />
            </div>

            <div className="ml-3 ml-md-5">
              <p className="h1 font-weight-boldest mt-6 mb-7">
                Clean <br/> Electrification!
              </p>

              <p className="h3">...and then there's everything else</p>
            </div>
          </div>


          <p>Decarbonization is also <strong>inevitable</strong>. Wind, solar, and batteries are getting so cheap, they’re starting to outcompete fossil fuels. And they’re only going to get cheaper.</p>

          <p>The problem: decarbonization is going to <strong>take too long</strong> to avoid the worst effects of climate change. We need to speed it way up, using climate policy. And with climate action blocked in Congress, the path forward is through the states.</p>

          <h2 className="pt-3">Why focus on states?</h2>
          <p>Three reasons:</p>
          <ol>
            <li><strong>Clarity</strong>: at a global or even national scale, the climate crisis can be incredibly overwhelming. At the state level, solutions become much clearer.</li>
            <li><strong>Opportunity</strong>: state and local governments are responsible for 50-75% of the climate action we need—regardless of what Congress does—according to <a href="https://www.climatecabinetaction.org/">Climate Cabinet</a>. And they can have a surprisingly huge impact: taken together, CO, IL, WA, CA, and NY make up the world’s 4th largest economy. They’ve all passed groundbreaking climate laws recently. And with the right policy, they could single-handedly make solar panels, wind turbines, heat pumps, and electric cars much cheaper, worldwide.</li>
            <li><strong>Accessibility</strong>: it’s much easier for regular people to make a difference at the state level. You can lobby your legislators personally. You can run for local office, or get someone elected. You can join one of the issue campaigns that are winning climate policy across the country—typically, they have only have a few dozen volunteers, so your involvement can actually help pass a bill.</li>
          </ol>
          <p>Ready to do something in your state? <a href="do-something">Get started here</a>.</p>

          <h2 className="pt-3">Who built this?</h2>
          <p>This is an all-volunteer project made with love by folks from <a href="https://chihacknight.org/">ChiHackNight</a> and <a href="https://climate.win/">Win Climate</a>.</p>
          <p>The team includes: <a href="https://derekeder.com">Derek Eder</a>,<a href="https://www.linkedin.com/in/jpvelez/"> Juan-Pablo Velez</a>, <a href="https://viktorkoves.com/">Viktor Köves</a>, <a href="https://chihacknight.org/board-of-directors/sean-watland.html">Sean Watland</a>, <a href="https://www.linkedin.com/in/hkier/">Howard Kier</a>, <a href="https://dylanhalpern.com/">Dylan Halpern</a>, <a href="https://www.elisarudolph.com/">Elisa Rudolph</a>,<a href="https://www.linkedin.com/in/joyce-ohiri/"> Joyce Ohiri</a>, <a href="https://www.linkedin.com/in/sjegoodman/">Samantha Goodman</a>, <a href="https://www.linkedin.com/in/shelbybarron/">Shelby Barron</a>, <a href="https://www.linkedin.com/in/jackmadans/">Jack Madans</a>, Surag Nuthulapaty and Robert Herrera.</p>
          
          <p>The initial code for this project was forked from <a href="https://greenjobsdata.com/">Who benefits from climate ambition?</a> by Data for Progress, Sunrise Movement and DataMade.</p>

          <p>Images of appliances and cars come from <a href="https://electrifynow.net/">Electrify Now</a>. Images of power plants are from <a href="http://en.wikipedia.org/wiki/SimCity_2000">Sim City 2000</a> by Maxis and Electronic Arts.</p>

          <h2 className="pt-3">Where did you get your ideas?</h2>
          <p>Our visual storytelling approach was inspired by a recent talk by Juan-Pablo Velez titled<a href="https://chihacknight.org/events/2022/01/11/juan-pablo-velez.html"> “What does it actually take to decarbonize a state?</a>”</p>
          <p>The idea of using clean electrification as the lynchpin of decarbonization is heavily inspired by the book<a href="https://www.rewiringamerica.org/electrify-the-book"> “Electrify”</a>, by Saul Griffith from <a href="https://www.rewiringamerica.org/">Rewiring America</a>. It's amazing, read it.</p> 

          <h2 className="pt-3">Why do you only focus on wind and solar power? Is that reliable?</h2>
          <p>The key problem of wind and solar is <b>intermittency</b>: the wind doesn't always blow, and the sun doesn't always shine. Batteries can store solar power for use at night, or wind power for use on less windy days. But they can't extra energy during the summer to use in the winter, when there's less sun and wind.</p> 
          <p>To solve this <strong>seasonal intermittency</strong> problem, we use <strong>renewable overbuilding</strong>: the trick is to build enough wind and solar to reliably power your state during the winter. During the summer, you end up with more power than you need. But you can use it make green hydrogen, which can cleanly power planes, factories, and other hard-to-electrify machines.</p>
          <p>Our estimates of how much (overbuilt) wind and solar each state must build to</p>
          <ol>
            <li>produce reliable year-round power while</li>
            <li>fully electrifying cars and buildings</li> 
          </ol> 
          ...are based on the paper <a href="https://www.documentcloud.org/documents/21010255-perez-et-al-ultra-high-photovoltaic-penetration-where-to-deploy">Ultra-high photovoltaic penetration: Where to deploy</a> by Perez et al.

          <h2 className="pt-3">Why don't you feature nuclear power?</h2>
          <p>We are not against nuclear. On the contrary, our actually analysis assumes that <em>all existing nuclear plants</em> stay open for the foreseeable future.</p> 
          <p>Nuclear is <strong>safe</strong> and <strong>reliable</strong>. Though expensive, building more nuclear plants would allow us to build fewer wind and solar farms.</p> 
          <p>That said, this site <em>intentionally</em> depicts how much wind and solar we need to decarbonize every state, and argues that this "all-renewables" approach is fact feasible (and affordable) using <strong>overbuilding</strong>.</p>

          <h2 className="pt-3">Data and sources</h2>
          <p>All of the data used on this website are from publicly available and trusted government and nonprofit sources. Below is a description of the primary datasets and their publishers. For more details on how we discovered and worked with this data, take a look at our <a href="https://github.com/chihacknight/decarbonize-my-state/issues?q=label%3Adata">GitHub issue tracker for data</a> and our <a href="https://github.com/chihacknight/decarbonize-my-state/tree/main/data">data folder</a> of this open source project.</p>
          
          <h3 className="pt-2 h4">US Emissions by State</h3>
          <p>
            <strong><a href="https://datasets.wri.org/dataset/climate-watch-states-greenhouse-gas-emissions">Climate Watch - U.S. States Greenhouse Gas Emissions</a></strong>
            <br />World Resources Institute
            <br />March 23, 2021
          </p>
          
          <h3 className="pt-2 h4">US Building footprints and electrification</h3>
          <p>
            <strong><a href="https://github.com/microsoft/USBuildingFootprints">US Building Footprints</a></strong>
            <br />Microsoft Maps
            <br />Mar 27, 2021
          </p>

          <p>
            <strong><a href="https://www.nrel.gov/docs/fy22osti/81186.pdf">U.S. Building Stock Characterization Study</a></strong>
            <br />The National Renewable Energy Laboratory (NREL)
            <br />Dec 2021
          </p>

          <h3 className="pt-2 h4">Vehicles by State</h3>
          <p>
            <strong><a href="https://www.fhwa.dot.gov/policyinformation/statistics/2017/mv1.cfm">State Motor-Vehicle Registrations</a></strong>
            <br />US Department of Transportation
            <br />Feb 2021
          </p>

          <h3 className="pt-2 h4">Power plants by State</h3>
          <p>
            <strong><a href="https://www.epa.gov/airmarkets/power-plants-and-neighboring-communities#mapping">Environmental Justice Screening and Mapping Tool (EJScreen)</a></strong>
            <br />US Environmental Protection Agency (EPA)
            <br />Jan 27, 2021
          </p>

          <h3 className="pt-2 h4">State renewable generation targets</h3>
          <p>
            <strong><a href="https://www.eia.gov/opendata/v1/qb.php?category=1">Electric generation by source 2001-2021</a></strong>
            <br />US Energy Information Administration (EIA)
            <br />Updated Apr 2022
          </p>

          <h2 className="pt-3">Code</h2>
          <p>All the code for this site is open source and available on <a href="https://github.com/chihacknight/decarbonize-my-state/">GitHub</a> under the MIT license.</p>
          <p>Technologies used:</p>
          <ul>
            <li><a href="https://www.docker.com/">Docker</a></li>
            <li><a href="https://gatsbyjs.com/">Gatsby</a> and <a href="https://reactjs.org/">React</a> for the website</li>
            <li><a href="https://github.com/datamade/data-making-guidelines">Make</a>, <a href="https://www.python.org/">python</a> and <a href="https://pandas.pydata.org/">pandas</a> for data processing
            </li>
          </ul>
          <p>This website is hosted on <a href="https://www.netlify.com/">Netlify</a>.</p>
          
          <h2 className="pt-3">Contact us</h2>
          <p>Found a bug?<a href="https://github.com/chihacknight/decarbonize-my-state/issues"> Report it on our issue tracker!</a></p>
          <p>Have a suggestion or question? Contact us at <a href="mailto:info@decarbmystate.com">info@decarbmystate.com</a></p>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage

export const query = graphql`
  query AboutQuery {
    allBuildingsJson {
      edges {
        node {
          buildings
          state
        }
      }
    }
    allEmissionsJson {
      edges {
        node {
          state
          emissionsByYear {
            buildings
            dumps_farms_industrial_other
            dirty_power
            transportation
            year
          }
        }
      }
    }
  }
`