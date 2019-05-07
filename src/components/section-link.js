import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const SectionLink = ({ number, heading, shortSlug }) => (
  <Link to={shortSlug}><h2>Section {number}: {heading}</h2></Link>
);

SectionLink.propTypes = {
  number: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  shortSlug: PropTypes.string.isRequired,
};

export default SectionLink;
