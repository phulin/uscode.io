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

import Navbar from "./navbar";
import Theme from "./theme";

const TextContainer = styled(Container)({
  margin: `0 !important`,
  "@media (max-width: 767.98px)": {
    padding: `0 10px !important`,
  },
  "@media (min-width: 768px)": {
    padding: `0 60px !important`,
  },
});

const Margins = styled.div({
  display: `flex`,
});

const HoverGutter = styled.div({
  flexGrow: 1,
  zIndex: 1000,
  "@media (max-width: 767.98px)": {
    margin: `0 -10px !important`,
  },
  "@media (min-width: 768px)": {
    margin: `0 -60px !important`,
  },
});

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

  onToggleNightMode() {
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
    const { breadcrumbs, children } = this.props;
    const theme = this.state.nightMode ? `darkly` : `flatly`;
    return (
      <>
        <Global
          styles={{
            body: {
              hyphens: `auto`,
            },
            main: {
              position: `relative`,
            },
            ".ml40, .p.indent1, .p.indent2, .p.indent3, .p.indent4, .p.indent5, .p.indent6": {
              marginLeft: `40px`,
            },
            "li .p.indent1, li .p.indent2, li .p.indent3, li .p.indent4, li .p.indent5, li .p.indent6": {
              marginLeft: 0,
            },
            "@media (max-width: 767.98px)": {
              ".ml40, li .p.indent1, li .p.indent2, li .p.indent3, li .p.indent4, li .p.indent5, li .p.indent6": {
                marginLeft: `20px`,
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
                display: `none !important`,
              },
              ".container": {
                maxWidth: `max-content !important`,
              },
            },
          }}
        />
        <Theme theme={theme} />
        <Margins>
          <HoverGutter data-hover-hide-links />
          <TextContainer>
            <Navbar
              breadcrumbs={breadcrumbs}
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
          </TextContainer>
          <HoverGutter />
        </Margins>
      </>
    );
  }
}

Layout.propTypes = {
  breadcrumbs: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Layout;
