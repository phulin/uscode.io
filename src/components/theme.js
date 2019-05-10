import React from "react";
import PropTypes from "prop-types";

import Helmet from "react-helmet";

/* TODO: Somehow avoid flash of unthemed content. */
import "../css/flatly/bootstrap.min.css";

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

class Theme extends React.Component {
  constructor(props) {
    super(props);
    this.createStylesheet();
  }

  href(theme) {
    return `https://cdn.jsdelivr.net/gh/phulin/bootswatch@7915d440/dist/${theme}/bootstrap.css`;
  }

  createStylesheet() {
    if (typeof document === `undefined`) { return; }

    const { theme } = this.props;

    const link = document.createElement(`link`);
    link.setAttribute(`type`, `text/css`);
    link.setAttribute(`rel`, `stylesheet`);
    link.setAttribute(`href`, this.href(theme));
    link.setAttribute(`data-theme`, theme);
    document.head.appendChild(link);
    return link;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props === prevProps) { return; }
    if (typeof document === `undefined`) { return; }

    const link = this.createStylesheet();
    link.onload = e => {
      // Props might have changed - be careful.
      const { theme } = this.props;
      const oldLinks = document.head.querySelectorAll(
        `link:not([data-theme="${theme}"])`
      );
      for (const oldLink of oldLinks) {
        oldLink.parentNode.removeChild(oldLink);
      }
    };
  }

  render() { return <></>; }
}

Theme.propTypes = { theme: PropTypes.string.isRequired };

export default Theme;
