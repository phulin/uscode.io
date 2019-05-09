import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import SectionOrGroup from "./section-or-group";

const SectionGroup = ({
  childNodes,
  slug,
  humanLevel,
  number,
  heading,
  linkAs,
}) => {
  const Component = linkAs;
  return (
    <>
      <Link to={slug}>
        <Component>
          {humanLevel} {number}: {heading}
        </Component>
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
};

SectionGroup.propTypes = {
  childNodes: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  humanLevel: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  linkAs: PropTypes.any,
};

SectionGroup.defaultProps = {
  linkAs: `span`,
};

export default SectionGroup;
