import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

// image resources
import HomeElectrificationDiagram from "../images/electrification-appliances.webp"
import ClimateCabinet from "../images/climate-cabinet.png"

const TakeActionPage = () => {
  return (
    <Layout>
      <SEO title="Take Action! :: Decarbonize My State" />
      <div className="container">
        <h1 id="main">Take Action!</h1>

        <h2>Ready to do your part?</h2>

        <p>
          The best way to decarbonize your state is to electrify it, and there
          are two big ways you can do your part -{" "}
          <a href="#electrify">personally electrifying your machines</a> and{" "}
          <a href="#get-political">getting political</a>!
        </p>

        <div className="row">
          <h2 className="col-lg-12 mb-4" id="electrify">
            Get Personal: Electrify your machines!
          </h2>

          <div className="col-lg-8">
            <p>
              <img
                className="img-fluid img-thumbnail"
                src={HomeElectrificationDiagram}
                alt="Electrify Everything in Your Home by Rewiring America"
                title="Electrify Everything in Your Home by Rewiring America"
              />

              <small>
                <span class="font-weight-bold">Source:</span>{" "}
                <a
                  href="https://www.rewiringamerica.org/electrify-home-guide"
                  target="_blank"
                  rel="noreferrer"
                >
                  Electrify Home Guide, Rewiring America
                </a>
              </small>
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8">
            <p>
              For most Americans, more than half your carbon footprint comes
              from how you heat and power your home and from the car you drive.
              More than cutting out meat or single use plastics, the most
              impactful thing you can do – by far – is to eliminate your
              personal burning of fossil fuels.
            </p>

            <ol className="font-weight-bold">
              <li>
                Replace your gas appliances with electric, including:
                <ul className="mb-3">
                  <li>
                    Replacing your gas heating system to an{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Heat_pump"
                      target="_blank"
                      rel="noreferrer"
                    >
                      electric heat pump
                    </a>
                  </li>
                  <li>
                    Replacing your gas stove with an{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Induction_cooking"
                      target="_blank"
                      rel="noreferrer"
                    >
                      induction stove
                    </a>
                  </li>
                  <li>Replacing your gas water heater to an electric one</li>
                </ul>
              </li>

              <li className="mb-3">
                If you drive, <strong>your next car must be electric</strong>
              </li>

              <li>
                Produce your own power with solar panels or enroll in{" "}
                <a
                  href="https://www.energy.gov/eere/solar/community-solar-basics"
                  target="_blank"
                  rel="noreferrer"
                >
                  community solar
                </a>
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
              </a>
              , for steps on how to get started.
            </p>

            <div>
              <h3 className="mb-2">
                Congress Passed The IRA Making All Of These Cheaper!
              </h3>

              <p>
                With the passing of the Inflation Reduction Act (IRA), there are
                now new national rebates for electrification of household
                appliances.
              </p>

              <ul className="mt-2">
                <li>
                  Up to $7,500 for a new electric vehicle or $4,000 for a used
                  electric vehicle
                </li>
                <li className="mt-1">
                  Up to $8,000 for a heat pump for heating and cooling
                </li>
                <li className="mt-1">
                  Up to $4,000 to upgrade your electrical panel (to prepare for
                  an all-electric home)
                </li>
                <li className="mt-1">Up to $2,500 for new wiring</li>
                <li className="mt-1">
                  {" "}
                  Up to $1,750 for a heat pump water heater
                </li>
                <li className="mt-1">
                  {" "}
                  Up to $1,600 for insulation, air sealing, and ventilation{" "}
                </li>
                <li className="mt-1 mb-1">
                  Up to $840 for an electric stove, oven, or an electric heat
                  pump dryer
                </li>
              </ul>

              <p>
                See how much money will you get with the Inflation Reduction Act
                with the Rewiring America Inflation Reduction Act
                Calculator!
              </p>

              <p>
                <a
                  className="btn btn-success"
                  href="https://www.rewiringamerica.org/app/ira-calculator"
                  target="_blank"
                  rel="noreferrer"
                >
                  Find Out How Much You Can Save With Rewiring America's Calculator
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-9">
            <h2 id="get-political">Get Political: Electrify the rest!</h2>

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
        </div>

        <h3>Elect Climate Candidates</h3>

        <div className="row mt-4">
          <div className="col-lg-3">
            <p>
              <img
                className="img-fluid img-thumbnail"
                src={ClimateCabinet}
                alt="Climate Cabinet"
              />
            </p>
          </div>

          <div className="col-lg-6">
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
              Climate Cabinet also creates a curated "Climate Slate", of climate
              friendly candidates in local races - and you can donate to support
              all of them!
            </p>

            <p>
              <a
                className="btn btn-success"
                href="https://www.climateslate.com/candidates?filter-by-Priority=Top%20Priority"
                target="_blank"
                rel="noreferrer"
              >
                Donate to the Climate Slate by Climate Cabinet
              </a>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-9 mb-6">
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
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default TakeActionPage
