import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import Breadcrumbs from "./breadcrumbs";
import SectionOrGroup from "./section-or-group";

const SectionGroup = ({
  withLink,
  childNodes,
  slug,
  humanLevel,
  number,
  heading,
  breadcrumbs,
}) => (
  <>
    {withLink ? (
      <Link to={slug}>
        {humanLevel} {number}: {heading}
      </Link>
    ) : (
      <>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <h1>
          {humanLevel} {number}: {heading}
        </h1>
      </>
    )}
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
  withLink: PropTypes.bool,
  childNodes: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  humanLevel: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.array,
};

SectionGroup.defaultProps = {
  withLink: true,
};

export default SectionGroup;
