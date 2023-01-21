import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import SingleBarChart from "../components/singlebar"
import { getLatestUsData } from "../components/getLatestEmissions"
import { getLongCitation } from "../constants/source-citations.js"

import ChloePhoto from "../images/team/chloe.jpg"
import DerekPhoto from "../images/team/derek.jpg"
import ViktorPhoto from "../images/team/viktor.jpg"
import SuragPhoto from "../images/team/surag.jpg"
import SeanPhoto from "../images/team/sean.jpg"

const getCleanData = data => {
  let mutableDataObj = {}

  for (let i = 0; i < data.allEmissionsJson.edges.length; i++) {
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

const AboutPage = ({ data }) => {
  const cleanData = getCleanData(data)
  const barChartData = getLatestUsData(cleanData)[0]

  return (
    <Layout>
      <SEO title="About | Decarb My State" />
      <div className="container col-lg-10">
        <div>
          <h1 id="main">About Decarb My State</h1>

          <p>
            Tired of waiting for Congress to act on the climate crisis? Then,{" "}
            <strong>decarbonize your state</strong>.
          </p>
          <p>
            Decarb My State allows Americans to picture exactly{" "}
            <strong>where</strong> their state’s carbon pollution comes from,
            and <strong>how</strong> to eliminate it.
          </p>

          <h2 className="pt-3">Ok then, how do we end climate pollution?</h2>
          <p>
            Decarbonization is <strong>simple</strong>—in every state, we can
            eliminate most emissions using{" "}
            <strong>clean electrification</strong>:
          </p>

          <ol>
            <li>
              We <strong>electrify</strong> the fossil fuel machines we use to
              heat our homes, cook our food, and get around.
            </li>
            <li>
              We <strong>clean</strong> all our electricity, mostly by building
              wind and solar. (And we need to <strong>double</strong> the
              electricity we produce today, to power our new electric machines.)
            </li>
          </ol>

          <div className="electrication-cont d-flex justify-content-center my-3">
            {/* Desktop only graph */}
            <div className="d-none d-md-block">
              <SingleBarChart emissionsData={barChartData} homeView={true} />
            </div>
            {/* Mobile only graph */}
            <div className="d-md-none">
              <SingleBarChart
                emissionsData={barChartData}
                homeView={true}
                mobileView={true}
              />
            </div>

            <div className="ml-3 ml-md-5">
              <p className="h1 font-weight-boldest mt-6 mb-7">
                Clean <br /> Electrification!
              </p>

              <p className="h3">...and then there's everything else</p>
            </div>
          </div>

          <p>
            Decarbonization is also <strong>inevitable</strong>. Wind, solar,
            and batteries are getting so cheap, they’re starting to outcompete
            fossil fuels. And they’re only going to get cheaper.
          </p>
          <p>
            The problem: decarbonization is going to{" "}
            <strong>take too long</strong> to avoid the worst effects of climate
            change. We need to speed it way up, using climate policy. And with
            climate action blocked in Congress, the path forward is through the
            states.
          </p>

          <h2 className="pt-3">Our Team</h2>

          <p>
            This is an all-volunteer project made with love by folks from{" "}
            <a href="https://chihacknight.org/">ChiHackNight</a> and{" "}
            <a href="https://climate.win/">Win Climate</a>.
          </p>

          <p>Our team includes:</p>

          {/* Show team members with photos in columns */}
          <div className="row justify-content-center mt-4 mb-3 col-md-10">
            <div className="col-6 col-md-4 text-center mb-3 m-l-0">
              <img src={DerekPhoto} className="rounded img-fluid" />

              <p className="text-center mt-3">
                <a href="https://derekeder.com">Derek Eder</a> <br />
                Founder, DataMade
              </p>
            </div>

            <div className="col-6 col-md-4 text-center mb-3 m-l-0">
              <img src={ViktorPhoto} className="rounded img-fluid" />

              <p className="text-center mt-3">
                <a href="https://viktorkoves.com/">Viktor Köves</a> <br />
                Senior Front-End Engineer, Packback
              </p>
            </div>

            <div className="col-6 col-md-4 text-center mb-3 m-l-0">
              <img src={SuragPhoto} className="rounded img-fluid" />

              <p className="text-center mt-3">
                Surag Nuthulapaty <br />
                Developer
              </p>
            </div>

            <div className="col-6 col-md-4 text-center mb-3 m-l-0">
              <img src={ChloePhoto} className="rounded img-fluid" />

              <p className="text-center mt-3">
                Chloe Xu <br />
                UX Strategist
              </p>
            </div>

            <div className="col-6 col-md-4 text-center mb-3 m-l-0">
              <img src={SeanPhoto} className="rounded img-fluid" />

              <p className="text-center mt-3">
                Sean Watland <br />
                Senior Business Intelligence Analyst, dscout
              </p>
            </div>
          </div>

          <p>
            <a href="https://dylanhalpern.com/">Dylan Halpern</a>,
            Robert Herrera,{" "}
            <a href="https://www.linkedin.com/in/hkier/">Howard Kier</a>,{" "}
            <a href="https://www.linkedin.com/in/jpvelez/"> Juan-Pablo Velez</a>
            ,{" "}
            , <a href="https://www.elisarudolph.com/">Elisa Rudolph</a>,
            <a href="https://www.linkedin.com/in/joyce-ohiri/"> Joyce Ohiri</a>,{" "}
            <a href="https://www.linkedin.com/in/sjegoodman/">
              Samantha Goodman
            </a>
            ,{" "}
            <a href="https://www.linkedin.com/in/shelbybarron/">
              Shelby Barron
            </a>
            , and{" "}
            <a href="https://www.linkedin.com/in/jackmadans/">Jack Madans</a>.
          </p>

          <p>
            The initial code for this project was forked from{" "}
            <a href="https://greenjobsdata.com/">
              Who benefits from climate ambition?
            </a>{" "}
            by Data for Progress, Sunrise Movement and DataMade.
          </p>

          <p>
            Images of appliances and cars come from{" "}
            <a href="https://electrifynow.net/">Electrify Now</a>. Images of
            power plants are from{" "}
            <a href="http://en.wikipedia.org/wiki/SimCity_2000">
              Sim City 2000
            </a>{" "}
            by Maxis and Electronic Arts.
          </p>

          <h2 className="pt-3">Our Inspiration</h2>
          <p>
            Our visual storytelling approach was inspired by a recent talk by
            Juan-Pablo Velez titled
            <a href="https://chihacknight.org/events/2022/01/11/juan-pablo-velez.html">
              {" "}
              “What does it actually take to decarbonize a state?
            </a>
            ”
          </p>
          <p>
            The idea of using clean electrification as the lynchpin of
            decarbonization is heavily inspired by the book
            <a href="https://www.rewiringamerica.org/electrify-the-book">
              {" "}
              “Electrify”
            </a>
            , by Saul Griffith from{" "}
            <a href="https://www.rewiringamerica.org/">Rewiring America</a>.
            It's amazing, read it.
          </p>

          <h2 className="pt-3">Data and Sources</h2>
          <p>
            All of the data used on this website are from publicly available and
            trusted government and nonprofit sources. Below is a description of
            the primary datasets and their publishers. For more details on how
            we discovered and worked with this data, take a look at our{" "}
            <a href="https://github.com/chihacknight/decarbonize-my-state/issues?q=label%3Adata">
              GitHub issue tracker for data
            </a>{" "}
            and our{" "}
            <a href="https://github.com/chihacknight/decarbonize-my-state/tree/main/data">
              data folder
            </a>{" "}
            of this open source project.
          </p>

          <h3 className="pt-2 h4">U.S. Emissions By State</h3>
          {getLongCitation("emissions")}

          <h3 className="pt-2 h4">
            U.S. Building Footprints And Electrification
          </h3>
          {getLongCitation("building-footprints")}
          {getLongCitation("building-energy")}

          <h3 className="pt-2 h4">Vehicles By State</h3>
          {getLongCitation("vehicles")}

          <h3 className="pt-2 h4">Power Plants By State</h3>
          {getLongCitation("power-plants")}

          <h3 className="pt-2 h4">State Renewable Generation Targets</h3>
          {getLongCitation("power-generation")}

          <h2 className="pt-3">Source Code</h2>
          <p>
            All the code for this site is open source and available on{" "}
            <a href="https://github.com/chihacknight/decarbonize-my-state/">
              GitHub
            </a>{" "}
            under the MIT license.
          </p>
          <p>Technologies used:</p>
          <ul>
            <li>
              <a href="https://www.docker.com/">Docker</a>
            </li>
            <li>
              <a href="https://gatsbyjs.com/">Gatsby</a> and{" "}
              <a href="https://reactjs.org/">React</a> for the website
            </li>
            <li>
              <a href="https://github.com/datamade/data-making-guidelines">
                Make
              </a>
              , <a href="https://www.python.org/">python</a> and{" "}
              <a href="https://pandas.pydata.org/">pandas</a> for data
              processing
            </li>
          </ul>
          <p>
            This website is hosted on{" "}
            <a href="https://www.netlify.com/">Netlify</a>.
          </p>

          <h2 className="pt-3">Contact us</h2>
          <p>
            Found a bug?{" "}
            <a href="https://github.com/chihacknight/decarbonize-my-state/issues">
              Report it on our issue tracker!
            </a>
          </p>
          <p>
            Have a suggestion or question? Contact us at{" "}
            <a href="mailto:info@decarbmystate.com">info@decarbmystate.com</a>
          </p>
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
