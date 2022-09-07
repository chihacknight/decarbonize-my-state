import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Terminology = () => {
  return (
    <Layout>
      <SEO title="Terminology" />
      <div className="container">
        <h1 id="main" className="py-2 mb-3">
          Terms to Know
        </h1>

        <div className="mt-0">
          <p>
          <strong>Carbon</strong> - a nonmetallic chemical element with atomic number 6 that
            readily forms compounds with many other elements and is a
            constituent of organic compounds in all known living tissues&nbsp;
          </p>
          <p>
          <strong>Carbon Dioxide</strong> - a molecule consisting of one carbon atom and two
            oxygen atoms.&nbsp; A product of combustion, respiration and other
            natural processes.&nbsp; Also a greenhouse gas in excessive
            quantities.
          </p>
          <p><strong>Decarbonize</strong> -&nbsp; to move away from carbon producing appliances</p>
          <p>
          <strong>Electrification</strong> - the process of converting combustion engines,
            heating and cooking appliances from fossil fuels (mainly gasoline
            and natural gas) to electric.
          </p>
          <p>
          <strong>Geothermal</strong> - The natural heat emanating from the Earth&rsquo;s core
            being conveyed by either magma or water to the Earth&rsquo;s surface
            where it can be converted to electricity or used to heat homes.
          </p>
          <p>
          <strong>Greenhouse gasses (GHG)</strong> - any of various gaseous compounds (such as
            carbon dioxide or ozone) that absorb infrared light, trapping&nbsp;
            heat in the atmosphere, and contributes to the greenhouse effect
          </p>
          <p>
          <strong>Greenhouse effect</strong> - the conversion of infrared light into
            heat.&nbsp; Most noticed in closed automobiles on a sunny day.
          </p>
          <p><strong>Megawatt</strong> - a unit of energy. One megawatt can power 400-900 homes a year.</p>
          <p>
          <strong>MTCO2e</strong> - Metric tons of carbon dioxide equivalent{" "}
            or MTCO2e is the unit of measurement in this tool. The unit "CO2e"
            represents an amount of a GHG whose atmospheric impact has been
            standardized to that of one unit mass of carbon dioxide (CO2), based
            on the global warming potential (GWP) of the gas.
          </p>
          <p>
          <strong>Renewable Energy</strong> - Electricity which is produced by either wind,
            solar or geothermal sources.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Terminology
