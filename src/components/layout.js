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

    this.state = { nightMode: false };
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
    const { breadcrumbs, children } = this.props;
    const theme = this.state.nightMode ? `darkly` : `flatly`;
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
          <Navbar
            breadcrumbs={breadcrumbs}
            nightMode={this.state.nightMode}
            onToggleNightMode={this.onToggleNightMode}
          />
          <main>{children}</main>
          <footer style={{ marginTop: `2rem` }}>
            <small className="text-muted">
              <a href="https://github.com/phulin/uscode.io">HTML layout</a> ©{" "}
              {new Date().getFullYear()} Patrick Hulin. Derived from data
              provided by the{" "}
              <a href="http://uscode.house.gov/">
                US House Office of the Law Revision Counsel
              </a>
              ; all content should be in the public domain.
            </small>
          </footer>
        </Container>
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

Layout.defaultProps = {
  breadcrumbs: <></>,
};

export default Layout;
