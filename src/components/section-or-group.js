import React from "react";
import PropTypes from "prop-types";

import SectionGroup from "./section-group";
import SectionLink from "./section-link";

const SectionOrGroup = props =>
  props.childNodes ? (
    <SectionGroup {...props} />
  ) : (
    <SectionLink {...props} humanLevel={props.humanLevel || `Section`} />
  );

SectionOrGroup.propTypes = {
  humanLevel: PropTypes.string,
  childNodes: PropTypes.array,
};

export default SectionOrGroup;
