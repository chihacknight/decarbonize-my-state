import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <h1>Page not found</h1>
    <p>Try going back to the <Link to="/" >home page</Link>.</p>
  </Layout>
)

export default NotFoundPage
