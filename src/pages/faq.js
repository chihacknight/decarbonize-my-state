import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import LinkImg from "../images/icons/link.svg"

const FAQ = () => {
  return (
    <Layout>
      <SEO title="FAQ | Decarb My State" />
      <div className="container faq col-lg-10">
        <h1 id="main" className="py-2">
          Frequently Asked Questions
        </h1>
        <p>
          Do you have questions? We've compiled some of the most common ones we
          get into this one page.
        </p>
        <div className="row align-items-center ml-0 mt-5">
          <h2 id="general">
            General
            <a href="#general" className="ml-3">
              <img
                src={LinkImg}
                alt="Link to 'General' heading"
                className="link-icon"
              />
            </a>
          </h2>

          <div className="building-sheet -house -clean"></div>
        </div>
        <h3>Why focus on states?</h3>
        <p>Three reasons:</p>
        <ol>
          <li>
            <strong>Clarity</strong>: at a global or even national scale, the
            climate crisis can be incredibly overwhelming. At the state level,
            solutions become much clearer.
          </li>
          <li>
            <strong>Opportunity</strong>: state and local governments are
            responsible for 50-75% of the climate action we need—regardless of
            what Congress does—according to{" "}
            <a href="https://www.climatecabinetaction.org/">Climate Cabinet</a>.
            And they can have a surprisingly huge impact: taken together, CO,
            IL, WA, CA, and NY make up the world’s 4th largest economy. They’ve
            all passed groundbreaking climate laws recently. And with the right
            policy, they could single-handedly make solar panels, wind turbines,
            heat pumps, and electric cars much cheaper, worldwide.
          </li>
          <li>
            <strong>Accessibility</strong>: it’s much easier for regular people
            to make a difference at the state level. You can lobby your
            legislators personally. You can run for local office, or get someone
            elected. You can join one of the issue campaigns that are winning
            climate policy across the country—typically, they have only have a
            few dozen volunteers, so your involvement can actually help pass a
            bill.
          </li>
        </ol>
        <p>
          Ready to do something in your state?{" "}
          <a href="do-something">Get started here</a>.
        </p>
        <h3>
          Why do you only focus on wind and solar power? Is that reliable?
        </h3>
        <p>
          The key problem of wind and solar is <b>intermittency</b>: the wind
          doesn't always blow, and the sun doesn't always shine. Batteries can
          store solar power for use at night, or wind power for use on less
          windy days. But they can't extra energy during the summer to use in
          the winter, when there's less sun and wind.
        </p>
        <p>
          To solve this <strong>seasonal intermittency</strong> problem, we use{" "}
          <strong>renewable overbuilding</strong>: the trick is to build enough
          wind and solar to reliably power your state during the winter. During
          the summer, you end up with more power than you need. But you can use
          it make green hydrogen, which can cleanly power planes, factories, and
          other hard-to-electrify machines.
        </p>
        <p>
          Our estimates of how much (overbuilt) wind and solar each state must
          build to
        </p>
        <ol>
          <li>produce reliable year-round power while</li>
          <li>fully electrifying cars and buildings</li>
        </ol>
        ...are based on the paper{" "}
        <a href="https://www.documentcloud.org/documents/21010255-perez-et-al-ultra-high-photovoltaic-penetration-where-to-deploy">
          Ultra-high photovoltaic penetration: Where to deploy
        </a>{" "}
        by Perez et al.
        <h3>Why don't you feature nuclear power?</h3>
        <p>
          We are not against nuclear. On the contrary, our actually analysis
          assumes that <em>all existing nuclear plants</em> stay open for the
          foreseeable future.
        </p>
        <p>
          Nuclear is <strong>safe</strong> and <strong>reliable</strong>. Though
          expensive, building more nuclear plants would allow us to build fewer
          wind and solar farms.
        </p>
        <p>
          That said, this site <em>intentionally</em> depicts how much wind and
          solar we need to decarbonize every state, and argues that this
          "all-renewables" approach is fact feasible (and affordable) using{" "}
          <strong>overbuilding</strong>.
        </p>
        {/*
         * Heat Pumps Section
         */}
        <div className="row align-items-center ml-0 mt-5">
          <h2 id="heat-pumps">
            Heat Pumps
            <a href="#heat-pumps" className="ml-3">
              <img
                src={LinkImg}
                alt="Link to 'Heat Pumps' heading"
                className="link-icon"
              />
            </a>
          </h2>

          <div className="appliance-sheet -heater -clean ml-4"></div>
        </div>
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
          </a>
          .
        </p>
        {/**
         * Electric Vehicle Section
         */}
        <div className="row align-items-center ml-0 mt-5">
          <h2 id="electric-vehicles">
            Electric Vehicles (EVs)
            <a href="#electric-vehicles" className="ml-3">
              <img
                src={LinkImg}
                alt="Link to 'Electric Vehicles' heading"
                className="link-icon"
              />
            </a>
          </h2>

          <div className="car-sheet -truck -clean ml-4"></div>
        </div>
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
         * Induction Stoves Section
         */}
        <div className="row align-items-center ml-0 mt-5">
          <h2 id="induction-stoves">
            Induction Stoves
            <a href="#induction-stoves" className="ml-3">
              <img
                src={LinkImg}
                alt="Link to 'Induction Stoves' heading"
                className="link-icon"
              />
            </a>
          </h2>

          <div className="appliance-sheet -stove -clean ml-4"></div>
        </div>
        <h3>Do induction stoves only work on certain pans?</h3>
        <p>
          Technically, yes, but they work on <em>ferro-magnetic</em> materials,
          meaning materials that a magnet can stick to. These include stainless
          steel, cast iron, and enameled cast iron pans, but induction{" "}
          <em>does not work</em> on copper, glass, or aluminum pans.
        </p>
        <p>
          Learn more from{" "}
          <a href="https://www.thespruceeats.com/what-is-the-best-cookware-for-induction-cooktops-908920">
            The Spruce Eats - How to Tell If Your Cookware Is Induction
            Compatible
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
        <h3>
          Is induction cooking the same as an electric stove with those glowing
          red coils?
        </h3>
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
          However, if you have a working electric resistance cooktop and you are
          satisfied with it - keep it! There's no climate benefit to switching
          from an electric cooktop to an induction cooktop - the benefit comes
          from switching a gas powered stove to an electric one that can be
          powered by clean renewable energy.
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
