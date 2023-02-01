import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { getTerminologyHover } from "../constants/terminology-list"

// image resources
import HomeElectrificationDiagram from "../images/electrification-appliances.webp"
import ClimateCabinet from "../images/climate-cabinet.png"
import NewTabIcon from "../images/icons/new-tab.svg"
import NewTabWhiteIcon from "../images/icons/new-tab-white.svg"

const TakeActionPage = () => {
  return (
    <Layout>
      <SEO title="Take Action | Decarb My State" />
      <div className="take-action container col-lg-10">
        <h1 id="main">Take Action!</h1>

        <div>
          <h2>Ready to do your part?</h2>

          <p>
            The best way to {getTerminologyHover("decarbonize")} your state is
            to electrify it, and there are two big ways you can do your part -{" "}
            <a href="#electrify">personally electrifying your machines</a> and{" "}
            <a href="#get-political">getting political</a>!
          </p>
        </div>

        <div>
          <h2 className="mb-4" id="electrify">
            Get Personal: Electrify your machines!
          </h2>

          <div>
            <p>
              <img
                className="img-fluid img-thumbnail col-lg-10"
                src={HomeElectrificationDiagram}
                alt="Electrify Everything in Your Home by Rewiring America"
                title="Electrify Everything in Your Home by Rewiring America"
              />
              <br />

              <small>
                <span class="font-weight-bold">Source:</span>{" "}
                <a
                  href="https://www.rewiringamerica.org/electrify-home-guide"
                  target="_blank"
                  rel="noreferrer"
                >
                  Electrify Home Guide, Rewiring America&nbsp;
                  <img
                    src={NewTabIcon}
                    alt="(opens in a new tab)"
                    className="new-tab-icon"
                  />
                </a>
              </small>
            </p>
          </div>
        </div>

        <div>
          <p>
            For most Americans, more than half your carbon footprint comes from
            how you heat and power your home and from the car you drive. More
            than cutting out meat or single use plastics, the most impactful
            thing you can do – by far – is to eliminate your personal burning of
            fossil fuels.
          </p>

          <ol className="font-weight-bold">
            <li>
              Replace your gas appliances with electric, including:
              <ul className="mb-3">
                <li>
                  Replacing your gas heating system with an{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Heat_pump"
                    target="_blank"
                    rel="noreferrer"
                  >
                    electric heat pump&nbsp;
                    <img
                      src={NewTabIcon}
                      alt="(opens in a new tab)"
                      className="new-tab-icon"
                    />
                  </a>
                </li>
                <li>
                  Replacing your gas stove with an{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Induction_cooking"
                    target="_blank"
                    rel="noreferrer"
                  >
                    induction stove&nbsp;
                    <img
                      src={NewTabIcon}
                      alt="(opens in a new tab)"
                      className="new-tab-icon"
                    />
                  </a>
                </li>
                <li>Replacing your gas water heater with an electric one</li>
              </ul>
            </li>

            <li className="mb-3">
              If you drive, <strong>make your next car electric</strong>
            </li>

            <li>
              Produce your own power by{" "}
              <a
                href="https://www.energysage.com/"
                target="_blank"
                rel="noreferrer"
              >
                installing your own solar panels&nbsp;
                <img
                  src={NewTabIcon}
                  alt="(opens in a new tab)"
                  className="new-tab-icon"
                />
              </a>{" "}
              or{" "}
              <a
                href="https://communitysolar.energysage.com/"
                target="_blank"
                rel="noreferrer"
              >
                enrolling in community solar&nbsp;
                <img
                  src={NewTabIcon}
                  alt="(opens in a new tab)"
                  className="new-tab-icon"
                />
              </a>
            </li>
          </ol>
          <p>
            40% of US climate pollution comes from decisions made around the
            kitchen table. We can’t solve climate change if you don’t electrify
            your home – and nobody can do it but you.
          </p>

          <p>
            Check out Rewiring America's free guide,{" "}
            <a
              href="https://www.rewiringamerica.org/electrify-home-guide"
              target="_blank"
              rel="noreferrer"
            >
              Electrify Everything in Your Home&nbsp;
              <img
                src={NewTabIcon}
                alt="(opens in a new tab)"
                className="new-tab-icon"
              />
            </a>
            , for steps on how to get started.
          </p>

          <div>
            <h3 className="mb-2">
              Congress Passed The IRA Making All Of These Cheaper!
            </h3>

            <p>
              With the passing of the Inflation Reduction Act (IRA), there are
              now new tax credits available for the electrification of household
              appliances, with up-front rebates for low and middle income
              households coming soon!
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
                Find Out How Much You Can Save With Rewiring America&nbsp;
                <img
                  src={NewTabWhiteIcon}
                  alt="(opens in a new tab)"
                  className="new-tab-icon -white"
                />
              </a>
            </p>
          </div>
        </div>

        <div>
          <h2 className="mt-6 mb-4" id="get-political">
            Get Political: Electrify the rest!
          </h2>

          <p>
            Discouraged by the inaction at the federal level? We can still win:
            50-75% of the policies we need to get to zero are actually state and
            local. And we’re starting to win them!
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
                Climate Cabinet Scorecard&nbsp;
                <img
                  src={NewTabIcon}
                  alt="(opens in a new tab)"
                  className="new-tab-icon"
                />
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
                Donate to the Climate Slate by Climate Cabinet&nbsp;
                <img
                  src={NewTabWhiteIcon}
                  alt="(opens in a new tab)"
                  className="new-tab-icon -white"
                />
              </a>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3>Pressure Electeds to Pass Climate Policy</h3>

          <p>
            It’s not enough to elect better candidates - we also have to
            pressure existing electeds to pass key climate policy now. Campaigns
            to do this already exist in your state – the highest impact thing
            you can do is join them!
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
            Find Your Representatives & Contact Them About Climate&nbsp;
            <img
              src={NewTabWhiteIcon}
              alt="(opens in a new tab)"
              className="new-tab-icon -white"
            />
          </a>
        </div>
      </div>
    </Layout>
  )
}

export default TakeActionPage
