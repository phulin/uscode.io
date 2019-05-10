import React from "react";
import PropTypes from "prop-types";

/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

class Theme extends React.Component {
  createStylesheet() {
    const { theme } = this.props;
    const stylesheet = `https://cdn.jsdelivr.net/gh/phulin/bootswatch@7915d440/dist/${theme}/bootstrap.css`;

    const link = document.createElement(`link`);
    link.setAttribute(`type`, `text/css`);
    link.setAttribute(`rel`, `stylesheet`);
    link.setAttribute(`href`, stylesheet);
    link.setAttribute(`data-theme`, theme);
    document.head.appendChild(link);
    return link;
  }

  componentDidMount() {
    this.createStylesheet();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props === prevProps) { return; }
    if (typeof document === `undefined`) { return; }

    const link = this.createStylesheet();
    link.onload = (e) => {
      // Props might have changed - be careful.
      const { theme } = this.props;
      const oldLinks = document.head.querySelectorAll(`link:not([data-theme="${theme}"])`);
      for (const oldLink of oldLinks) {
        oldLink.parentNode.removeChild(oldLink);
      }
    }
  }

  render() { return <></>; }
}

Theme.propTypes = { theme: PropTypes.string.isRequired };

export default Theme;
