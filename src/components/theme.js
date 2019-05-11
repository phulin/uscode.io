import React from "react";
import PropTypes from "prop-types";

import Helmet from "react-helmet";

class Theme extends React.Component {
  constructor(props) {
    super(props);

    this.state = { initialized: false };

    if (typeof document !== `undefined`) {
      const link = this.createStylesheet();
      link.onload = () => this.setState({ initialized: true });
    }
  }

  href() {
    const theme = this.props.theme;
    return `https://cdn.jsdelivr.net/gh/phulin/bootswatch@7915d440/dist/${theme}/bootstrap.min.css`;
  }

  createStylesheet() {
    if (typeof document === `undefined`) {
      return;
    }

    const { theme } = this.props;

    /* eslint-disable no-undef */
    const link = document.createElement(`link`);
    link.setAttribute(`type`, `text/css`);
    link.setAttribute(`rel`, `stylesheet`);
    link.setAttribute(`href`, this.href());
    link.setAttribute(`data-theme`, theme);
    document.head.appendChild(link);
    /* eslint-enable no-undef */
    return link;
  }

  /* eslint-disable-next-line no-unused-vars */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.theme === prevProps.theme) {
      return;
    }
    if (typeof document === `undefined`) {
      return;
    }

    const link = this.createStylesheet();
    link.onload = () => {
      // Props might have changed - be careful.
      const { theme } = this.props;
      this.setState({ initialized: true });
      /* eslint-disable-next-line no-undef */
      const oldLinks = document.head.querySelectorAll(
        `link:not([data-theme="${theme}"])`
      );
      for (const oldLink of oldLinks) {
        oldLink.parentNode.removeChild(oldLink);
      }
    };
  }

  render() {
    return this.state.initialized ? <></> :
      <link rel="stylesheet" type="text/css" href={this.href()} />;
  }
}

Theme.propTypes = { theme: PropTypes.string.isRequired };

export default Theme;
