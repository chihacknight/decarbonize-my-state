import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AboutPage = ({data, location}) => {

  return (
    <Layout>
      <SEO title="About :: Decarbonize My State" />
      <div className="container">
        <div>
          <h1 id="main border-bottom" className="py-4">About Decarbonize My State</h1>
          <p>We have { 2050 - new Date().getFullYear() } years to reduce worldwide emissions to zero to avoid the worst impacts of climate change. But how do we get there and what can I do to help?</p>
          <p><strong>Decarbonize My State </strong>is a website built to answer that question and galvanize US residents to take direct and personal action to fight climate change. Inspired by a recent talk by Juan-Pablo Velez titled<a href="https://chihacknight.org/events/2022/01/11/juan-pablo-velez.html"> “What does it actually take to decarbonize a state?</a>” and the book<a href="https://www.rewiringamerica.org/electrify-the-book"> “Electrify”, by Saul Griffith from Rewiring America</a>, we've gathered data on climate pollution and its sources for each state to make convincing arguments for society-wide electrification and investment in renewable energy like wind and solar.</p>
          <p>Our goals for this website are to help people working on this project and our immediate peers and neighbors to:</p>
          <ul>
            <li>Understand what has to happen to decarbonize each US state, and what policies need to be passed to drive those actions</li>
            <li>Learn the highest impact ways individuals can help</li>
            <li>Electrify their own fossil fuel infrastructure</li>
            <li>Join political campaigns to pass those policies</li> 
            <li>Dispel common misconceptions and strawman arguments against electrification</li>
          </ul>
          <h2 className="pt-3">Team and credits</h2>
          <p>This is an all-volunteer project built at <a href="https://chihacknight.org/">Chi Hack Night</a>, a weekly civic tech and data event based in Chicago.</p>
          <p>The team includes: <a href="https://derekeder.com">Derek Eder</a>,<a href="https://www.linkedin.com/in/jpvelez/"> Juan-Pablo Velez</a>, <a href="https://viktorkoves.com/">Viktor Köves</a>, <a href="https://chihacknight.org/board-of-directors/sean-watland.html">Sean Watland</a>, <a href="https://www.linkedin.com/in/hkier/">Howard Kier</a>, <a href="https://dylanhalpern.com/">Dylan Halpern</a>, <a href="https://www.elisarudolph.com/">Elisa Rudolph</a>,<a href="https://www.linkedin.com/in/joyce-ohiri/"> Joyce Ohiri</a>, <a href="https://www.linkedin.com/in/sjegoodman/">Samantha Goodman</a>, and <a href="https://www.linkedin.com/in/shelbybarron/">Shelby Barron</a>.</p>
          <p>The initial code for this project was forked from <a href="https://greenjobsdata.com/">Who benefits from climate ambition?</a> by Data for Progress, Sunrise Movement and DataMade.</p>
          
          <h2 className="pt-3">Data and sources</h2>
          <p>All of the data used on this website are from publicly available and trusted government and nonprofit sources. Below is a description of the primary datasets and their publishers. For more details on how we discovered and worked with this data, take a look at our <a href="https://github.com/chihacknight/decarbonize-my-state/issues?q=label%3Adata">GitHub issue tracker for data</a> and our <a href="https://github.com/chihacknight/decarbonize-my-state/tree/main/data">data folder</a> of this open source project.</p>
          
          <h3 className="pt-2">US Emissions by State</h3>
          <p>
            <strong><a href="https://datasets.wri.org/dataset/climate-watch-states-greenhouse-gas-emissions">Climate Watch - U.S. States Greenhouse Gas Emissions</a></strong>
            <br />World Resources Institute
            <br />March 23, 2021
          </p>
          
          <h3 className="pt-2">US Building footprints and electrification</h3>
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

          <h3 className="pt-2">Vehicles by State</h3>
          <p>
            <strong><a href="https://www.fhwa.dot.gov/policyinformation/statistics/2017/mv1.cfm">State Motor-Vehicle Registrations</a></strong>
            <br />US Department of Transportation
            <br />Feb 2021
          </p>

          <h3 className="pt-2">Power plants by State</h3>
          <p>
            <strong><a href="https://www.epa.gov/airmarkets/power-plants-and-neighboring-communities#mapping">Environmental Justice Screening and Mapping Tool (EJScreen)</a></strong>
            <br />US Environmental Protection Agency (EPA)
            <br />Jan 27, 2021
          </p>

          <h3 className="pt-2">State renewable generation targets</h3>
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
          <p>Have a suggestion or question? Contact us at <a href="mailto:info@decarbonizemystate.com">info@decarbonizemystate.com</a></p>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
