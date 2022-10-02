import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const FAQ = () => {
  return (
    <Layout>
      <SEO title="FAQ" />
      <div className="container faq">
        <h1 id="main" className="py-2">
          Frequently Asked Questions
        </h1>

        <p>
          Do you have questions? We've compiled some of the most common ones we
          get into this one page.
        </p>

        <h2>Heat Pumps</h2>

        <h3>Do heat pumps work in colder climates?</h3>

        <p>
          Heat pumps absolutely work in cold climates. Not only that, but often
          they are the most energy efficient and cost effective solution
          available. A few decades ago, most heat pumps stopped working when the
          temperature dropped below 20 or 30 degrees fahrenheit. By contrast,
          today’s heat pumps can run more efficiently than any other HVAC system
          all the way down to about -25 fahrenheit. Just ask the millions of
          homeowners in Scandinavia. People in Norway, Finland and Sweden are
          installing heat pumps at a faster pace than anywhere else in Europe.
        </p>
        <p>
          In colder climates, a potential hurdle to installing heat pumps is
          home insulation. You may want to get a{" "}
          <a href="https://www.energy.gov/energysaver/blower-door-tests">
            blower door test
          </a>{" "}
          to determine how much heat you are leaking from your home.
        </p>
        <p>
          Learn more{" "}
          <a href="https://carbonswitch.com/do-heat-pumps-work-in-cold-weather/">
            about heat pumps and cold weather at CarbonSwitch
          </a>
          .
        </p>

        {/**
         * Electric Vehicle Section
         */}
        <h2>Electric Vehicles (EVs)</h2>

        <h3>
          Are EVs <em>really</em> lower emission, even with a dirty grid?
        </h3>

        <p>
          Based off of information from
          <a href="https://www.epa.gov/greenvehicles/electric-vehicle-myths#Myth1">
            {" "}
            the EPA's page on electric vehicles
          </a>
          , here's the short answer:
        </p>

        <p>
          <strong>
            Electric vehicles almost always have a smaller carbon footprint than
            gasoline cars
          </strong>
          , even when accounting for the electricity used for charging, and even
          if your grid is very carbon intensive, like coal.
        </p>

        <p>
          The longer answer: Electric vehicles (EVs) have no tailpipe emissions.
          Generating the electricity used to charge EVs, however, may create
          carbon pollution. The amount varies widely based on how local power is
          generated, e.g., using coal or natural gas, which emit carbon
          pollution, versus renewable resources like wind or solar, which do
          not. Even accounting for these electricity emissions, research shows
          that an EV is typically responsible for lower levels of greenhouse
          gases (GHGs) than an average new gasoline car. As more renewable
          energy generation is brought online (or if you charge your car using
          your own solar panels) the total GHGs associated with EVs could be
          even lower.
        </p>

        <p>
          If that sounds confusing, think about it this way: a gas car runs{" "}
          <em>completely</em> off of gasoline, and doesn't even burn it that
          efficiently. We already have some renewables (which have no emissions)
          and a large fossil fuel power plant can convert more of that chemical
          energy into usable electricity, rather than heat.
        </p>

        <p>
          You can also
          <a href="https://www.epa.gov/egrid/power-profiler">
            {" "}
            learn more about electricity production in your area.
          </a>
        </p>

        <p>
          <a href="https://www.fueleconomy.gov/feg/Find.do?action=bt2">
            EPA and DOE’s Beyond Tailpipe Emissions Calculator
          </a>{" "}
          can help you estimate the greenhouse gas emissions associated with
          charging and driving an EV or a plug-in hybrid electric vehicle (PHEV)
          where you live. You can select an EV or PHEV model and type in your
          zip code to see the CO2 emissions and how they stack up against those
          associated with a gasoline car.
        </p>

        <h3>How long does it take to charge an EV?</h3>

        <p>
          This one is a bit complicated, but most new EVs support fast-charging
          at public charging stations, which (at the highest speeds of 250kW)
          can get most EVs to 80% in around a half hour.
        </p>

        <p>
          Learn more from{" "}
          <a href="https://www.tomsguide.com/reference/ev-charging-explained-heres-all-the-different-charger-types">
            Tom's Guide - EV Charging Explained
          </a>
          .
        </p>

        <h3>Why are EVs so expensive?</h3>

        <p>
          EVs require large battery packs, particularly if you are looking for a
          very long range. However, it's worth keeping in mind that an electric
          vehicle has lower fuel costs (electricity per mile is generally
          cheaper than gasoline) and lower maintenance costs, since electric
          vehicles are much simpler mechanically speaking and have lower brake
          wear due to regenerative braking.
        </p>

        <p>
          Learn more from{" "}
          <a href="https://www.consumersenergy.com/residential/programs-and-services/electric-vehicles/ev-cost-of-ownership">
            Consumers Energy - EV Cost of Ownership
          </a>
          .
        </p>

        <h3>Do we have enough Lithium to make all these EVs?</h3>

        <p>
          This is also complex, but ultimately speaking there is enough Lithium
          on the planet to meet our EV needs, but we're going to have to rapidly
          ramp up Lithium exctraction to meet our needs.
        </p>

        <p>
          Learn more from{" "}
          <a href="https://www.nature.com/articles/d41586-021-02222-1">
            Nature - Electric cars and batteries: how will the world produce
            enough?
          </a>
        </p>

        <h3>
          But are electric cars <em>really</em> the best climate transporation
          solution?
        </h3>

        <p>
          In short, no, but they are a big part of the solution. Electric cars
          and trucks require a lot of minerals and energy to manufacture,
          consume a lot of energy per mile due to their weight. In dense urban
          and suburban areas, we should work towards moving away from cars
          towards trains, buses, biking, and walking, which are much more energy
          resource efficient. However, as we mentioned before, an electric car
          is basically always better emissions wise than a gas car.
        </p>

        <p>
          As an example, an ebike (let's say Gazelle Ultimate T10) may have a
          500 Wh battery (0.5 kWh) that gives it a 25 mile range, or 50 miles
          per kWh. Meanwhile the Tesla Model 3, one of the most efficient EVs
          out right now, gets around 4.2 miles per kWh, making the{" "}
          <strong>e-bike 12 times more energy efficient!</strong> This does not
          even take into account the signifcantly reduced material cost and
          manufacturing emissions of making a 50 pound e-bike compared to a
          4,048 lb electric car with <em>at least</em> 100 times the battery
          capacity (54 kWh).
        </p>

        <p>
          Learn more at{" "}
          <a href="https://ourworldindata.org/travel-carbon-footprint">
            Our World in Data - Which form of transport has the lowest carbon
            footprint
          </a>
          .
        </p>
      </div>
    </Layout>
  )
}

export default FAQ
