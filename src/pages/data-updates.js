import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import DataUpdateReport from "../components/data-update/report"

// A frozen snapshot, see scripts/build-data-update.mjs
import dataUpdate from "../data/data-updates/2020-2025.json"

const DataUpdatesPage = () => (
  <Layout>
    <SEO
      title="2020 to 2025 Data Updates | Decarb My State"
      description="How each state's emissions, power, vehicle and home heating numbers changed when we updated our data."
    />
    <DataUpdateReport data={dataUpdate} />
  </Layout>
)

export default DataUpdatesPage
