import React, { useState } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const AboutPage = ({data, location}) => {
  const checkURL = () => {
    const greenJobsDefinition = location.state ? location.state.greenJobFAQ : false
    console.log(greenJobsDefinition)
    return greenJobsDefinition
  }

  return (
    <Layout>
      <SEO title="About" />
      <div className="container">
        <div className="border-bottom">
          <h1 className="py-2" id="overview">Overview</h1>
          <p>About this app</p>
        </div>
      </div>
    </Layout>
  )
}

export default AboutPage
