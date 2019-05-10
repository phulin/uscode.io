/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import PropTypes from "prop-types";

import { Global } from "@emotion/core";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Theme from "./theme";

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { nightMode: false };
    this.onToggleNightMode = this.onToggleNightMode.bind(this);

    // eslint-disable-next-line no-undef
    if (window) {
      // eslint-disable-next-line no-undef
      let nightMode = window.localStorage.getItem(`nightMode`);
      this.state.nightMode = nightMode === null ? false : nightMode === "true";
    }
  }

  onToggleNightMode(e) {
    e.preventDefault();
    this.setState(({ nightMode, ...state }) => {
      // eslint-disable-next-line no-undef
      window.localStorage.setItem(`nightMode`, !nightMode);
      return {
        ...state,
        nightMode: !nightMode,
      };
    });
  }

  render() {
    const { children } = this.props;
    const theme = this.state.nightMode ? `darkly` :`flatly`;
    return (
      <>
        <Global
          styles={{
            "*": {
              /*fontFamily: `"Open Sans", sans-serif`,*/
              hyphens: `auto`,
            },
            "p.indent1, p.indent2, p.indent3, p.indent4, p.indent5, p.indent6": {
              marginLeft: `40px`,
            },
          }}
        />
        <Theme theme={theme} />
        <Container>
          <Navbar bg="light" expand="sm">
            <Navbar.Brand href="/">uscode.io</Navbar.Brand>
            <Navbar.Collapse>
              <Nav className="ml-auto">
                <Button variant="light" onClick={this.onToggleNightMode}>
                  Night Mode
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <main>{children}</main>
          <footer style={{ marginTop: `2rem`, color: `gray` }}>
            <a href="https://github.com/phulin/uscode.io">HTML layout</a> ©{" "}
            {new Date().getFullYear()} Patrick Hulin. Derived from data provided
            by the{" "}
            <a href="http://uscode.house.gov/">
              US House Office of the Law Revision Counsel
            </a>
            ; all content should be in the public domain.
          </footer>
        </Container>
      </>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Layout;
