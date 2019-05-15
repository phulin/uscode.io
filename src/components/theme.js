import React from "react";
import PropTypes from "prop-types";

import Helmet from "react-helmet";

import "../../bootswatch/dist/flatly/bootstrap.min.css";

const themes = [`flatly`, `darkly`];

class Theme extends React.Component {
  static href(theme) {
    return `/${theme}/bootstrap.min.css`;
  }

  render() {
    const disabled = Object.fromEntries(themes.map(theme => [theme, { disabled: undefined }]));
    delete disabled[this.props.theme].disabled;
    return (
      <Helmet>
        {themes.map(theme => (
          <link
            key={theme}
            rel="stylesheet"
            type="text/css"
            href={Theme.href(theme)}
            data-theme={theme}
            {...disabled[theme]}
          />
        ))}
      </Helmet>
    );
  }
}

Theme.propTypes = { theme: PropTypes.string.isRequired };

export default Theme;
