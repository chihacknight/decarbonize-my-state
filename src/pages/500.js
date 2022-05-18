import React from "react"
import { Helmet } from "react-helmet"
import Layout from "../components/layout"
import SEO from "../components/seo"
import CoalPlant from "../images/coal-plant.png"

const ServerError = () => (
  <Layout>
    <SEO title="500: Server Error" />

    <div className="error-page">
      <img src={CoalPlant} alt="Coal Power Plant"/>
      <div>
        <h1>Server Error</h1>
        <p>Something went wrong. Please come again later.</p>
      </div>
      <img src={CoalPlant} alt="Coal Power Plant"/>
    </div>
  </Layout>
)

export default ServerError