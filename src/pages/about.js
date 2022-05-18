import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AboutPage = ({data, location}) => {

  return (
    <Layout>
      <SEO title="About :: What does it take to decarbonize your state?" />
      <div className="container">
        <div className="border-bottom">
          <h1 id="main" className="py-2">Overview</h1>
          <p>About this app</p>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
