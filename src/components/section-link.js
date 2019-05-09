import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const SectionLink = ({ number, heading, slug }) => (
  <Link to={slug}>Section {number}: {heading}</Link>
);

SectionLink.propTypes = {
  number: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
};

export default SectionLink;
