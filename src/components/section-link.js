import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const SectionLink = ({ linkAs, status, humanLevel, number, heading, slug }) => {
  const Component = linkAs;
  const text =
    `${heading.endsWith(`]`) ? `[` : ``}` +
    `${humanLevel} ${number}: ${heading}`;
  return status === `repealed` ? (
    <div className="text-muted">
      <Component>{text}</Component>
    </div>
  ) : (
    <Link to={slug}>
      <Component>{text}</Component>
    </Link>
  );
};

SectionLink.propTypes = {
  linkAs: PropTypes.any,
  status: PropTypes.string,
  humanLevel: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

SectionLink.defaultProps = {
  linkAs: `span`,
};

export default SectionLink;
