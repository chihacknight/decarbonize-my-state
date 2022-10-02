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

        {/**
         * Heat Pumps Section
         */}
        <h2>Heat Pumps</h2>

        <h3>Are heat pumps for heating, or for cooling?</h3>

        <p>
          Heat pumps are for both - they can heat and cool your home! There are
          a variety of different types of heat pumps, but they all work like a
          reversible air conditioner, moving heat from inside to outside
          (cooling) or outside to inside (heating).
        </p>

        <p>
          Learn more from{" "}
          <a href="https://www.energy.gov/energysaver/heat-pump-systems">
           Energy.gov - Heat Pump Systems
          </a>.
        </p>

        <h3>But do heat pumps work in cold climates?</h3>

        <p>
          Absolutely - although heat pumps used to have issues in lower
          temperatures, modern heat pumps can work great even in the cold
          climates of the Northeast and Midwest - they are even popular in
          chily Norway!
        </p>

        <p>
          Learn more from{" "}
          <a href="https://www.consumerreports.org/heat-pumps/can-heat-pumps-actually-work-in-cold-climates-a4929629430">
            Consumer Reports - Can Heat Pumps Actually Work in Cold Climates?
          </a>
        </p>

        {/**
         * Induction Stoves Section
         */}
        <h2>Induction Stoves</h2>

        <h3>Do induction stoves only work on certain pans?</h3>

        <p>
          Technically, yes, but they work on <em>ferro-magnetic</em> materials,
          meaning materials that a magnet can stick to. These include stainless
          steel, cast iron, and enameled cast iron pans, but
          induction <em>does not work</em> on copper, glass, or aluminum pans.
        </p>

        <p>
          Learn more from{" "}
          <a href="https://www.thespruceeats.com/what-is-the-best-cookware-for-induction-cooktops-908920">
            The Spruce Eats - How to Tell If Your Cookware Is Induction Compatible
          </a>
        </p>

        <h3>Are induction stoves worse than gas?</h3>

        <p>
          There might be some downsides with induction, like not working with
          certain types of pans and a lack of visibility to the heat output
          (since induction works via invisible magnetism) but it also has a huge
          list of benefits including:

          <ul>
            <li>Faster heating time (like water boiling quicker)</li>
            <li>Heat level changes apply rapidly</li>
            <li>Cook surface stays cool</li>
            <li>Automatically shuts off when pan is removed</li>
          </ul>
        </p>

        <h3>Is induction cooking the same as an electric stove with those glowing red coils?</h3>

        <p>
          Not at all! A stove with red coils that heat up your pan (either
          directly or through a glass surface) are what is known as an electric
          resistive cooktop or just electric cooktop. These are electrically
          powered (and so don't burn fossil fuels) but they aren't as
          responsive, fast, or efficient as induction cooktops. They work by
          heating using electrical resistance to heat up a coil (just like your
          toaster) which means a lot of heat is wasted transferring the energy
          through the glass surface and the pot. Induction cooking works by
          using electromagnetism to heat a pot or pan directly - which means
          almost all of the heat makes it into your food.
        </p>

        <p>
          However, if you have a working electric resistance cooktop and you
          are satisfied with it - keep it! There's no climate benefit to
          switching from an electric cooktop to an induction cooktop - the
          benefit comes from switching a gas powered stove to an electric one
          that can be powered by clean renewable energy.
        </p>

        <p>
          Learn more from{" "}
          <a href="https://www.forbes.com/home-improvement/kitchen/induction-vs-electric-cooktop/">
            Forbes Home - Induction Vs Electric Cooktop: What’s The Difference?
          </a>
        </p>
      </div>
    </Layout>
  )
}

export default FAQ
