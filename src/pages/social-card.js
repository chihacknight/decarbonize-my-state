import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import OilPlantImg from "../images/oil-plant.png"

const NotFoundPage = () => (
  <Layout>
    <SEO title="Social Card" />
    <div className="error-page">
      <div>
        <h1 className="error-page-h" id="main">Social Card</h1>
        <p className="error-page-p">Sorry, we can't find that page. Try going back to the <Link to="/" >home page</Link>.</p>
      </div>
    </div>
  </Layout>
)

export default NotFoundPage
