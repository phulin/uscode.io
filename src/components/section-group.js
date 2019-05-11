import React from "react";
import PropTypes from "prop-types";

import SectionLink from "./section-link";
import SectionOrGroup from "./section-or-group";

const SectionGroup = ({ childNodes, ...props }) => (
  <>
    <SectionLink {...props} />
    <ul>
      {childNodes.map((child, i) => (
        <li key={i}>
          <SectionOrGroup {...child} />
        </li>
      ))}
    </ul>
  </>
);

SectionGroup.propTypes = {
  childNodes: PropTypes.array.isRequired,
};

export default SectionGroup;
