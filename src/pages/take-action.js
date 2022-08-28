import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

// image resources
import ElectrifyEverything from "../images/electrify-everything.jpg";
import ClimateCabinet from "../images/climate-cabinet.png";

const TakeActionPage = () => {
  return (
    <Layout>
      <SEO title="Take Action! :: Decarbonize My State" />
      <div className="container">
        <h1 id="main">Ready to do your part?</h1>

        <p>
          The best way to decarbonize your state is to electrify it. There are
          two big ways you can do your part.
        </p>

        <div className="row">
          <div className="col-lg-9">
            <h2>Get Personal: Electrify your machines!</h2>
            <p>
              For most Americans, more than half your carbon footprint comes
              from how you heat and power your home and from the car you drive.
              More than cutting out meat or single use plastics, the most
              impactful thing you can do – by far – is to eliminate your
              personal burning of fossil fuels:
            </p>
            <ol>
              <li>
                Replace your heating system with an{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Heat_pump"
                  target="_blank"
                  rel="noreferrer"
                >
                  electric heat pump
                </a>
                , your gas stove with an{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Induction_cooking"
                  target="_blank"
                  rel="noreferrer"
                >
                  induction stove
                </a>
                , and your water heater with an electric one
              </li>
              <li>If you drive, your next car must be electric</li>
              <li>Produce your own power with solar panels</li>
            </ol>
            <p>
              40% of US climate pollution comes from decisions made around the
              kitchen table. We can’t solve climate change if you don’t
              electrify your home – and nobody can do it but you.
            </p>

            <p>
              Check out Rewiring America's free guide{" "}
              <a
                href="https://www.rewiringamerica.org/electrify-home-guide"
                target="_blank"
                rel="noreferrer"
              >
                Electrify Everything in Your Home
              </a>{" "}
              for steps on how to get started.
            </p>
          </div>
          <div className="col-lg-3">
            <p>
              <a
                href="https://www.rewiringamerica.org/electrify-home-guide"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="img-fluid img-thumbnail"
                  src={ElectrifyEverything}
                  alt="Electrify Everything in Your Home by Rewiring America"
                  title="Electrify Everything in Your Home by Rewiring America"
                />
              </a>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-9">
            <h2>Get Political: Electrify the rest!</h2>
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

        <div className="row">
          <div className="col-lg-9">
            <h3>Elect Climate Candidates</h3>
            <p>
              You can take meaningful action right now by donating to{" "}
              <strong>Climate Cabinet</strong>, a political action group that
              helps climate champions run for local office and pass critical
              legislation.
            </p>
            <p>
              <a
                className="btn btn-success"
                href="https://secure.actblue.com/donate/climateslate?refcode=decarbmystate"
              >
                Donate to the Climate Slate by Climate Cabinet
              </a>
            </p>
          </div>
          <div className="col-lg-3">
            <p>
              <a
                href="https://www.climateslate.com/candidates?filter-by-Priority=Top%20Priority"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  className="img-fluid img-thumbnail"
                  src={ClimateCabinet}
                  alt="Climate Cabinet"
                />
              </a>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-9">
            <h3>Pressure Electeds to Pass Climate Policy</h3>
            <p>
              It’s not enough to elect better candidates - we also have to
              pressure existing electeds to pass key climate policy now.
              Campaigns to do this already exist in your state – the highest
              impact thing you can do is join them.
            </p>

            <p>
              Sign up below and we will share what we know about climate
              campaigns in your state.
            </p>

            <div className="form-container embed-responsive embed-responsive-16by9">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSdiwiT6OZO0jsnLu22r6ClBZLh8fvfGIiYu_5coOvjYXqogtw/viewform?embedded=true"
                title="DecarbMyState Sign Up Form"
                className="embed-responsive-item"
                width="640"
                height="1720"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TakeActionPage;
