/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Row, Col } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'

import '../styles/global.css'
import Header from "../components/header"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Header siteTitle={data.site.siteMetadata.title} />
      <main role="main">
        <div class="container">
          <Row>
            <Col>
              {children}
            </Col>
          </Row>
        </div>  
      </main>
      <footer>
        <hr />
        <p>&#169; 2021 <a href="https://dataforprogress.org" target="_blank" rel="noreferrer">Data for Progress</a>. Website by <a href="https://datamade.us" target="_blank" rel="noreferrer">DataMade</a> and <a href="https://www.sunrisemovement.org/" target="_blank" rel="noreferrer">Sunrise Movement</a>.</p>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
