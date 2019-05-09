/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import PropTypes from "prop-types";

import { Global } from "@emotion/core";
import styled from "@emotion/styled";

import Container from "react-bootstrap/Container";

import "bootstrap/dist/css/bootstrap.min.css";
import "typeface-open-sans";

const Layout = ({ children }) => (
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
    <Container>
      <main>{children}</main>
      <footer style={{ marginTop: `2rem`, color: `gray` }}>
        <a href="https://github.com/phulin/uscode.io">HTML layout</a> ©{" "}
        {new Date().getFullYear()} Patrick Hulin. Derived from data provided by
        the{" "}
        <a href="http://uscode.house.gov/">
          US House Office of the Law Revision Counsel
        </a>
        ; all content should be in the public domain.
      </footer>
    </Container>
  </>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Layout;
