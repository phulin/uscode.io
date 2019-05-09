import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import Breadcrumb from "react-bootstrap/Breadcrumb";

const LinkHref = ({ href, children, ...props }) => (
  <Link to={href} {...props}>
    {children}
  </Link>
);

LinkHref.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOf([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const Breadcrumbs = ({ breadcrumbs, current }) => (
  <Breadcrumb className="mt-3">
    {breadcrumbs.map((bc, i) => (
      <li className="breadcrumb-item" key={bc.slug}>
        <Link to={bc.slug}>
          {i === 0 ? `U.S. Code ` : ``}
          {bc.humanLevel} {bc.number}
        </Link>
      </li>
    ))}
    <li className="breadcrumb-item active" aria-current="page">
      <span className="active">
        {breadcrumbs.length === 0 ? `U.S. Code ` : ``}
        {current.humanLevel} {current.number}
      </span>
    </li>
  </Breadcrumb>
);

Breadcrumbs.propTypes = {
  current: PropTypes.shape({
    humanLevel: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
  }),
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      humanLevel: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Breadcrumbs;
