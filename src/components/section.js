import React from "react";
import PropTypes from "prop-types";

const Section = ({ heading, number, breadcrumbs }) => (
  <h1>{breadcrumbs[0].number} U.S.C. § {number}. {heading}</h1>
);

Section.propTypes = {
  heading: PropTypes.string,
  number: PropTypes.string,
  breadcrumbs: PropTypes.array,
};

export default Section;
