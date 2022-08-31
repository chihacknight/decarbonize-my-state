import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const FAQ = () => {
  return (
    <Layout>
      <SEO title="FAQ" />
      <div className="container">
        <h1 id="main" className="py-2">Frequently Asked Questions</h1>

        <p>
          Do you have questions? We've compiled some of the most common ones we
          get into this one page.
        </p>

        <h2>Heat Pumps</h2>

        <h3>Do heat pumps work in colder climates?</h3>

        <p>
          Google this question or ask a contractor and you might think the answer is no. But make no mistake, heat pumps absolutely work in cold climates. Not only that, but often they are the most energy efficient and cost effective solution available.
          A few decades ago, most heat pumps stopped working when the temperature dropped below 20 or 30 degrees fahrenheit. By contrast, today’s heat pumps can run more efficiently than any other HVAC system all the way down to about -25 fahrenheit.
          Just ask the millions of homeowners in Scandinavia. People in Norway, Finland and Sweden are installing heat pumps at a faster pace than anywhere else in Europe.
          <a href="https://carbonswitch.com/do-heat-pumps-work-in-cold-weather/">Read more at CarbonSwitch</a>
        </p>

        <h2>Electric Vehicles (EVs)</h2>

        <h3>Are EVs <em>really</em> lower emission, even with a dirty grid?</h3>

        <p>
          Based off of information from
          <a href="https://www.epa.gov/greenvehicles/electric-vehicle-myths#Myth1"> the EPA's page on electric vehicles</a>, here's
          the short answer:
        </p>

        <p className="h6 font-weight-bold">
          Electric vehicles almost always have a smaller carbon footprint than gasoline cars, even when accounting for the electricity used for charging, and even if your grid is very carbon intensive, like coal.
        </p>

        <p>
          The longer answer: Electric vehicles (EVs) have no tailpipe emissions. Generating the electricity used to charge EVs, however, may create carbon pollution. The amount varies widely based on how local power is generated, e.g., using coal or natural gas, which emit carbon pollution, versus renewable resources like wind or solar, which do not. Even accounting for these electricity emissions, research shows that an EV is typically responsible for lower levels of greenhouse gases (GHGs) than an average new gasoline car. As more renewable energy generation is brought online (or if you charge your car using your own solar panels) the total GHGs associated with EVs could be even lower.
        </p>

        <p>
          If that sounds confusing, think about it this way: a gas car runs <em>completely</em> off of gasoline, and doesn't even burn it that efficiently. We already have some renewables (which have no emissions) and a large fossil fuel power plant can convert more of that chemical energy into usable electricity, rather than heat.
        </p>

        <p>
          You can also
          <a href="https://www.epa.gov/egrid/power-profiler"> learn more about electricity production in your area.
          </a>
        </p>

        <p>
          <a href="https://www.fueleconomy.gov/feg/Find.do?action=bt2">
            EPA and DOE’s Beyond Tailpipe Emissions Calculator
          </a> can help you estimate the greenhouse gas emissions associated with charging and driving an EV or a plug-in hybrid electric vehicle (PHEV) where you live. You can select an EV or PHEV model and type in your zip code to see the CO2 emissions and how they stack up against those associated with a gasoline car.
        </p>

      </div>
    </Layout>
  )
}

export default FAQ