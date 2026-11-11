import React from "react"
import { Navbar, Nav } from "react-bootstrap"
import { Link } from "gatsby"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/terminology", label: "Terminology" },
  { to: "/faq", label: "FAQ" },
  { to: "/take-action", label: "Take Action" },
]

const Header = ({ siteTitle }) => (
  <>
    <Navbar
      collapseOnSelect
      expand="lg"
      className="sunrise-nav"
    >
      <a
        className="sr-only sr-only-focusable skip-link btn btn-light"
        href="#main"
      >
        Skip to main content
      </a>
      <Link className="nav-text text-body" to="/">
        {siteTitle}
      </Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              className="nav-link"
              activeClassName="active"
              // Match "/faq/" too, but only highlight Home on the home page
              partiallyActive={to !== "/"}
              data-label={label}
              to={to}
            >
              {label}
            </Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </>
)

export default Header
