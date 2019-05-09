import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

const Breadcrumbs = ({ breadcrumbs }) =>
  breadcrumbs.map((bc, i) => (
    <span key={bc.slug}>
      <Link to={bc.slug}>
        {`${i === 0 ? `U.S. Code` : ``} ${bc.humanLevel} ${bc.number}`}
      </Link>
      {` > `}
    </span>
  ));

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      humanLevel: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Breadcrumbs;
