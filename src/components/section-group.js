import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import SectionOrGroup from "./section-or-group";

const SectionGroup = ({ childNodes, slug, level, number, heading }) => (
  <>
    <Link to={slug}>
      <h2>
        {level} {number}: {heading}
      </h2>
    </Link>
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
  slug: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
};

export default SectionGroup;
