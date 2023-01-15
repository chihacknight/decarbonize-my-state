import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { terminologyDefs } from "../constants/terminology-list"

const Terminology = () => {
  return (
    <Layout>
      <SEO title="Terminology | Decarb My State" />

      <div className="container col-lg-10">
        <h1 id="main" className="mb-2">
          Terms to Know
        </h1>

        <dl className="mt-0 terminology-page-style">
          {terminologyDefs.map(t => (
            <>
              <dt id={t.slug}>{t.term} <a class='text-muted small' href={`#${t.slug}`}>#</a></dt>
              <dd>{t.definition}</dd>
            </>
          ))}
        </dl>
      </div>
    </Layout>
  )
}

export default Terminology
