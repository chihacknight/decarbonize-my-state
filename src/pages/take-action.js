import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import NewTabIcon from "../components/new-tab-icon"
import { getTerminologyHover } from "../constants/terminology-list"

// image resources
import HomeElectrificationDiagram from "../images/electrification-appliances.webp"
import ClimateCabinet from "../images/climate-cabinet.png"

const TakeActionPage = () => {
  return (
    <Layout>
      <SEO title="Take Action | Decarb My State" />
      <div className="take-action container col-lg-10">
        <h1 id="main">Take Action!</h1>

        <div>
          <h2 className="mb-4">Ready to do your part?</h2>

          <p>
            The best way to {getTerminologyHover("decarbonize")} your state is
            to electrify it, and there are a few big ways you can do your part.
          </p>
          <p>
            <strong>Are you a homeowner?</strong> You can{" "}
            <a href="#homeowners">personally electrify your machines</a>
          </p>

          <p>
            <strong>Are you a renter?</strong> Check out our{" "}
            <a href="#renters">suggestions for renters</a>
          </p>

          <p>
            And whether you're a homeowner or a renter, the biggest impact is{" "}
            <a href="#get-political">getting political</a>! Policy can shape
            whole industries.
          </p>
        </div>

        {/* Home Owners Section */}
        <section>
          <h2 className="heading-row mt-6 mb-4" id="homeowners">
            <div className="building-sheet -house -clean"></div>
            <div>
              Homeowners <br />
              <div className="sub-text">
                Get Personal & Electrify Your Machines
              </div>
            </div>
          </h2>

          <div>
            <p>
              For most Americans, more than half your carbon footprint comes
              from how you heat and power your home and from the car you drive.
              More than cutting out meat or single use plastics, the most
              impactful thing you can do – by far – is to eliminate your
              personal burning of fossil fuels.
            </p>

            <ol>
              <li>
                <strong>Replace your gas appliances with electric</strong>,{" "}
                including:
                <ul>
                  <li className="mt-2">
                    Replacing your gas heating system with a{" "}
                    <strong>{getTerminologyHover("heat-pump")}</strong>.
                  </li>

                  <li className="mt-2">
                    Replacing your gas stove with an{" "}
                    <strong>{getTerminologyHover("induction-stove")}</strong>.
                  </li>

                  <li className="mt-2">
                    Replacing your gas water heater with an electric one.
                  </li>
                </ul>
              </li>

              <li className="mt-3">
                If you drive,{" "}
                <strong>
                  make your next car electric or switch to an e-bike and public
                  transit
                </strong>
                .
              </li>

              <li className="mt-3">
                <strong>Switch to renewable power</strong> by{" "}
                <a
                  href="https://www.energysage.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  installing your own solar panels
                  <NewTabIcon />
                </a>{" "}
                or{" "}
                <a
                  href="https://communitysolar.energysage.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  enrolling in community solar
                  <NewTabIcon />
                </a>
                .
              </li>
            </ol>
            <p>
              40% of US climate pollution comes from decisions made around the
              kitchen table. We can’t solve climate change if you don’t
              electrify your home – and nobody can do it but you.
            </p>

            <p>
              Check out Rewiring America's free guide,{" "}
              <a
                href="https://www.rewiringamerica.org/electrify-home-guide"
                target="_blank"
                rel="noreferrer"
              >
                Electrify Everything in Your Home
                <NewTabIcon />
              </a>
              , for steps on how to get started.
            </p>

            <div>
              <img
                className="img-fluid img-thumbnail col-lg-8"
                src={HomeElectrificationDiagram}
                alt="Electrify Everything in Your Home by Rewiring America"
                title="Electrify Everything in Your Home by Rewiring America"
              />
              <br />

              <small>
                <span className="font-weight-bold">Source:</span>{" "}
                <a
                  href="https://www.rewiringamerica.org/electrify-home-guide"
                  target="_blank"
                  rel="noreferrer"
                >
                  Electrify Home Guide, Rewiring America
                  <NewTabIcon />
                </a>
              </small>
            </div>

            <div>
              <h3 className="h5 mb-2">
                Congress Passed The IRA Making All Of These Cheaper!
              </h3>

              <p>
                With the passing of the Inflation Reduction Act (IRA), there are
                now new tax credits available for the electrification of
                household appliances, with up-front rebates for low and middle
                income households coming soon!
              </p>

              <table className="savings-table table table-striped mt-2 col-lg-10">
                <caption>
                  Potential Electrification Tax Credits (Rewiring America, 2022)
                </caption>

                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Max. Tax Credit</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>New or Used Electric Car</td>
                    <td className="price-cell">$7,500 new / $4,000 used</td>
                  </tr>
                  <tr>
                    <td>Electric Car Charger</td>
                    <td className="price-cell">$1,000</td>
                  </tr>
                  <tr>
                    <td>Heat Pump Air Conditioner/Heater</td>
                    <td className="price-cell">$2,000</td>
                  </tr>
                  <tr>
                    <td>Rooftop Solar</td>
                    <td className="price-cell">30%</td>
                  </tr>
                  <tr>
                    <td>Battery Storage Installation</td>
                    <td className="price-cell">30%</td>
                  </tr>
                  <tr>
                    <td>
                      Electrical Panel Upgrade
                      <span className="text-dark">
                        {" "}
                        (to prepare for an all-electric home)
                      </span>
                    </td>
                    <td className="price-cell">$600</td>
                  </tr>
                  <tr>
                    <td>
                      Weatherization
                      <span className="text-dark">
                        {" "}
                        (insulation, air sealing, and ventilation)
                      </span>
                    </td>
                    <td className="price-cell">$1,200</td>
                  </tr>
                  <tr>
                    <td>Heat Pump Water Heater</td>
                    <td className="price-cell">$2,000</td>
                  </tr>
                </tbody>
              </table>

              <p>
                See how much money will you get with the Inflation Reduction Act
                with the Rewiring America Inflation Reduction Act Calculator!
              </p>

              <p>
                <a
                  className="btn btn-success"
                  href="https://www.rewiringamerica.org/app/ira-calculator"
                  target="_blank"
                  rel="noreferrer"
                >
                  Find Out How Much You Can Save With Rewiring America
                  <NewTabIcon classes="-white" />
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Renters Section */}
        <section>
          <h2 className="heading-row mt-6 mb-4" id="renters">
            <div className="building-sheet -apartments -clean"></div>
            <div>
              Renters <br />
              <div className="sub-text">
                Switch Your Power Supplier & Talk To Your Landlord
              </div>
            </div>
          </h2>

          <p>
            In terms of personal actions, renters have a lot less direct control
            of their polluting machines, but there's still some things you can
            do.
          </p>

          <ol>
            <li>
              If you drive,{" "}
              <strong>
                make your next car electric or switch to an e-bike or public
                transit
              </strong>
              .
            </li>

            <li className="mt-3">
              <strong>
                Switch your electricity supply to renewable energy
              </strong>{" "}
              by{" "}
              <a
                href="https://communitysolar.energysage.com/"
                target="_blank"
                rel="noreferrer"
              >
                enrolling in community solar
                <NewTabIcon />
              </a>
              .
            </li>

            <li className="mt-3">
              <strong>Stop cooking with gas</strong> by getting a{" "}
              <a href="https://www.nytimes.com/wirecutter/reviews/best-portable-induction-cooktop/">
                portable induction cooktop
                <NewTabIcon />
              </a>{" "}
              for under $100.
            </li>

            <li className="mt-3">
              <strong>Talk to your landlord about electrifying</strong> -{" "}
              Especially if your old gas stove or dryer isn't working well, you
              have an opportunity to talk to your landlord about getting
              electric ones! It might be helpful to mention that electric
              appliances will improve your air quality, reduce your landlord's
              gas bill, and make an apartment more attractive to future tenants.
            </li>

            <li className="mt-3">
              <strong>Talk to homeowners you know about electrifying</strong> -{" "}
              Whether it's family, friends, or coworkers, talk about
              electrification! A lot of folks don't know about the benefits of
              electrification (including air quality and saving money on their
              energy bills) or haven't heard about technologies like{" "}
              {getTerminologyHover("heat-pumps")} or{" "}
              {getTerminologyHover("induction-stoves")}.
            </li>
          </ol>
        </section>

        {/* Get Political Section */}
        <section>
          <div>
            <h2 className="heading-row mt-6 mb-4" id="get-political">
              <div className="appliance-sheet -stove -clean"></div>
              <div>
                Everyone
                <div className="sub-text">
                  Get Political & Electrify The Rest!
                </div>
              </div>
            </h2>

            <p>
              Discouraged by the inaction at the federal level? We can still
              win: 50-75% of the policies we need to get to zero are actually
              state and local. And we’re starting to win them!
            </p>

            <p>
              By all means, electrify your own machines. To electrify the rest,
              support the candidates and issue campaigns already fighting to
              decarbonize your state.
            </p>
          </div>

          <h3>Elect Climate Candidates</h3>

          <div className="row mt-4">
            <div className="col-lg-4">
              <p>
                <img
                  className="img-fluid img-thumbnail"
                  src={ClimateCabinet}
                  alt="Climate Cabinet"
                />
              </p>
            </div>

            <div className="col-lg-8">
              <p>
                You can take meaningful action right now by donating to{" "}
                <strong>Climate Cabinet</strong>, a political action group that
                helps climate champions run for local office and pass critical
                legislation. They score candidates based on their climate
                credentials and provide information to candidates on their{" "}
                <a
                  href="https://www.climatecabinetaction.org/climate-cabinet-scorecard"
                  target="_blank"
                  rel="noreferrer"
                >
                  Climate Cabinet Scorecard
                </a>
                .
              </p>
              <p>
                Climate Cabinet also creates a curated "Climate Slate", of
                climate friendly candidates in local races - and you can donate
                to support all of them!
              </p>

              <p>
                <a
                  className="btn btn-success"
                  href="https://www.climateslate.com/candidates?filter-by-Priority=Top%20Priority"
                  target="_blank"
                  rel="noreferrer"
                >
                  Donate to the Climate Slate by Climate Cabinet
                  <NewTabIcon classes="-white" />
                </a>
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3>Pressure Electeds to Pass Climate Policy</h3>

            <p>
              It’s not enough to elect better candidates - we also have to
              pressure existing electeds to pass key climate policy now.
              Campaigns to do this already exist in your state – the highest
              impact thing you can do is join them!
            </p>

            <p>
              You can also contact your elected leaders to pressure them to take
              action.
            </p>

            <a
              className="btn btn-success"
              href="https://whoaremyrepresentatives.org/"
              target="_blank"
              rel="noreferrer"
            >
              Find Your Representatives & Contact Them About Climate
              <NewTabIcon classes="-white" />
            </a>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default TakeActionPage
