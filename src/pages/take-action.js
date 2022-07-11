import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const TakeActionPage = ({data, location}) => {

  return (
    <Layout>
      <SEO title="Take Action! :: Decarbonize My State" />
      <div className="container">
        <h1 id="main">Ready to do your part?</h1>
        <p>The best way to decarbonize your state is to electrify it. There are two big ways you can do your part.</p>

        <h2>Get Personal: Electrify your machines!</h2>
        <p>
          For most Americans, more than half your carbon footprint comes from how you heat and power your home, and from the car you drive. 
          More than cutting out meat or single use plastics, the most impactful thing you can do – by far – is to eliminate your personal burning of fossil fuels:
        </p>
        <ol>
          <li>Produce you own power with solar panels</li>
          <li>Replace your heating system with a heat pump, your gas stove with an induction stove.</li>
          <li>Replace your gas car with an electric one.</li>
        </ol>
        <p>
          40% of US climate pollution comes from decisions made around the kitchen table. We can’t solve climate change if you don’t electrify your home – and nobody can do it but you.
        </p>

        <h2>Get Political: Electrify the rest!</h2>

        <p>
          Discouraged by the inaction at the federal level? We can still win: 50-75% of the policies we need to get to zero are actually state and local. And we’re starting to win them!
        </p>
        <p>
          By all means, electrify your machines. To electrify the rest, support the candidates and issue campaigns already fighting to decarbonize your state. 
        </p>

        <ul>
          <li>
            <div className="font-weight-bold">Elect Climate Candidates:</div>
            You can take meaningful action right now by donating to Climate Cabinet, a political action group that helps climate champions run for local office and pass critical legislation, 
            <a href="https://www.climateslate.com/candidates?filter-by-Priority=Top%20Priority">Donate Now.</a> 
          </li>
          <li>
            <div className="font-weight-bold">
          Pressure Electeds to Pass Climate Policy:
            </div>
           It’s not enough to elect better candidates - we also have to pressure existing electeds to pass key climate policy now. Campaigns to do this already exist in your state – the highest impact thing you can do is join them. Sign up below and we will share what we know about climate campaigns in your state.
          </li>
        </ul>

        <h2>Learn about climate campaigns in your state!</h2>
        <div className="form-container embed-responsive embed-responsive-16by9">
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdiwiT6OZO0jsnLu22r6ClBZLh8fvfGIiYu_5coOvjYXqogtw/viewform?embedded=true"
            className="embed-responsive-item" width="640" height="1720"
            frameBorder="0" marginHeight="0" marginWidth="0">Loading…</iframe>
        </div>
      </div>
    </Layout>
  )
}

export default TakeActionPage
