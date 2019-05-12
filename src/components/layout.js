/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react";
import PropTypes from "prop-types";

import { Global } from "@emotion/core";

import Container from "react-bootstrap/Container";

import Navbar from "./navbar";
import Theme from "./theme";

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nightMode: false,
      visible: new Set(),
    };

    this.onToggleNightMode = this.onToggleNightMode.bind(this);

    // eslint-disable-next-line no-undef
    if (typeof window !== `undefined`) {
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
    const { breadcrumbs, navs, children } = this.props;
    const theme = this.state.nightMode ? `darkly` : `flatly`;
    return (
      <>
        <Global
          styles={{
            "*": {
              /*fontFamily: `"Open Sans", sans-serif`,*/
              hyphens: `auto`,
            },
            main: {
              position: `relative`,
            },
            ".p.indent1, .p.indent2, .p.indent3, .p.indent4, .p.indent5, .p.indent6": {
              marginLeft: `40px`,
            },
            "@media (max-width: 767.98px)": {
              ".p.indent1, .p.indent2, .p.indent3, .p.indent4, .p.indent5, .p.indent6": {
                marginLeft: `20px`,
              },
            },
            "li .p.indent1, li .p.indent2, li .p.indent3, li .p.indent4, li .p.indent5, li .p.indent6": {
              marginLeft: 0,
            },
            "@media (min-width: 768px)": {
              ".container": {
                padding: `0 60px`,
              },
            },
            "@media print": {
              "*": {
                color: `black !important`,
                backgroundColor: `white !important`,
              },
              a: {
                textDecoration: `none !important`,
              },
              "a[name]": {
                display: `none`,
              },
              ".container": {
                maxWidth: `max-content`,
              },
            },
          }}
        />
        <Theme theme={theme} />
        <Container>
          <Navbar
            breadcrumbs={breadcrumbs}
            navs={navs}
            nightMode={this.state.nightMode}
            onToggleNightMode={this.onToggleNightMode}
          />
          <main>{children}</main>
          <footer className="mt-4 mb-1">
            <small className="text-muted">
              <span className="d-print-none">
                <a href="https://github.com/phulin/uscode.io">HTML layout</a> ©{" "}
                {new Date().getFullYear()} Patrick Hulin. Derived from data
                provided by the{" "}
                <a href="http://uscode.house.gov/">
                  US House Office of the Law Revision Counsel
                </a>
                ; all content should be in the public domain. I make no warranty
                as to accuracy, recency, or any other aspect of this
                information.{" "}
              </span>
              <span>
                Based on{" "}
                <a href="http://uscode.house.gov/currency/currency.shtml">
                  data through Pub. L. No. 116-16 (Apr. 18, 2019)
                </a>
                .
              </span>
              <span className="d-none d-print-inline">
                {" "}Printed from uscode.io.
              </span>
            </small>
          </footer>
        </Container>
      </>
    );
  }
}

Layout.propTypes = {
  breadcrumbs: PropTypes.node,
  navs: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

Layout.defaultProps = {
  navs: {},
};

export default Layout;
