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
import "bootstrap/dist/css/bootstrap.min.css"
import NewTabIcon from "../components/new-tab-icon"

import "../styles/global.css"
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
        <div className="container">
          <Row>
            <Col>{children}</Col>
          </Row>
        </div>
      </main>
      <footer>
        <hr />
          &#169; 2022 - A Project From{" "}
          <a href="https://chihacknight.org" target="_blank" rel="noreferrer">
            Chi Hack Night
            <NewTabIcon/>
          </a>
      </footer>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
