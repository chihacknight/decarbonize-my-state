import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import OilPlantImg from "../images/oil-plant.png"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="error-page">
        <img src={OilPlantImg} />
      <div>
        <h1 className="error-page-h">404: Page not found</h1>
        <p className="error-page-p">Sorry, we can't find that page. Try going back to the <Link to="/" >home page</Link>.</p>
      </div>
        <img src={OilPlantImg} />
    </div>
  </Layout>
)

export default NotFoundPage
