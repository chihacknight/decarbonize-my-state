import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Terminology = () => {
  return (
    <Layout>
      <SEO title="Terminology" />
      <div className="container">
        <h1 id="main" className="mb-2">
          Terms to Know
        </h1>

        <dl className="mt-0 terminology-page-style">
          <dt>Carbon</dt>{" "}
          <dd>
            {" "}
            a nonmetallic chemical element with atomic number 6 that readily
            forms compounds with many other elements and is a constituent of
            organic compounds in all known living tissues&nbsp;
          </dd>
          <dt>Carbon Dioxide</dt>
          <dd>
            a molecule consisting of one carbon atom and two oxygen atoms.&nbsp;
            A product of combustion, respiration and other natural
            processes.&nbsp; Also a greenhouse gas.
          </dd>
          <dt>Decarbonize</dt>{" "}
          <dd>to move away from carbon producing appliances</dd>
          <dt>Electrification</dt>{" "}
          <dd>
            the process of converting combustion engines, heating and cooking
            appliances from fossil fuels (mainly gasoline and natural gas) to
            electric.
          </dd>
          <dt>Geothermal Energy</dt>{" "}
          <dd>
            The natural heat emanating from the Earth&rsquo;s core being
            conveyed by either magma or water to the Earth&rsquo;s surface where
            it can be converted to electricity or used to heat homes.
          </dd>
          <dt>Greenhouse gasses (GHG)</dt>{" "}
          <dd>
            {" "}
            any of various gaseous compounds (such as carbon dioxide or ozone)
            that absorb infrared light, trapping&nbsp; heat in the atmosphere,
            and contributes to the greenhouse effect
          </dd>
          <dt>Greenhouse effect</dt>{" "}
          <dd>
            the conversion of infrared light into heat.&nbsp; Most noticed in
            closed automobiles on a sunny day.
          </dd>
          <dt>Megawatt</dt>
          <dd>
            a unit of energy. One megawatt can power 400-900 homes a year.
          </dd>
          <dt>MTCO2e</dt>{" "}
          <dd>
            {" "}
            Metric tons of carbon dioxide equivalent or MTCO2e is the unit of
            measurement in this tool. The unit "CO2e" represents an amount of a
            GHG whose atmospheric impact has been standardized to that of one
            unit mass of carbon dioxide (CO2), based on the global warming
            potential (GWP) of the gas.
          </dd>
          <dt>Renewable Energy</dt>
          <dd>
            Electricity which is produced by either wind, solar or geothermal
            sources. As opposed to fossil fuels, which are non-renewable because
            they depend on oil, coal or other sources that take millions of
            years to be made. Solar, wind, and geothermal are thus relatively
            infinite.
          </dd>
        </dl>
      </div>
    </Layout>
  )
}

export default Terminology
