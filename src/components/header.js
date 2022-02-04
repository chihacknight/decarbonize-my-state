import React from "react"
import { Navbar, Nav } from "react-bootstrap"
import { Link } from "gatsby"


const Header = ({ siteTitle }) => (
  <Navbar
    collapseOnSelect
    expand="lg"
    className="sunrise-nav"
    style={{
      marginBottom: `1.45rem`
    }}
  >
    <a class="nav-text" href="https://dataforprogress.org" target="_blank" rel="noreferrer">
      <Link className="nav-text" to="">&nbsp;&nbsp;&nbsp;</Link>
      <Link className="nav-text" to="/">{siteTitle}</Link>
    </a>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="ml-auto">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/about">About</Link>
        <Link className="nav-link" to="/terminology">Terminology</Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Header
