import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "gatsby";

const Header = ({ siteTitle }) => (
  <>
    <Navbar
      collapseOnSelect
      expand="lg"
      className="sunrise-nav"
      style={{
        marginBottom: `1.45rem`
      }}
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
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/about">
            About
          </Link>
          <Link className="nav-link" to="/take-action">
            Take Action
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </>
);

export default Header;
