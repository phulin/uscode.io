import React from "react";
import PropTypes from "prop-types";

import SectionGroup from "./section-group";
import SectionLink from "./section-link";

const SectionOrGroup = props =>
  props.childNodes ? <SectionGroup {...props} /> : <SectionLink {...props} />;

SectionOrGroup.propTypes = {
  childNodes: PropTypes.array,
};

export default SectionOrGroup;
