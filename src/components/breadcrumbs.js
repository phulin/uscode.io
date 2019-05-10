import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import styled from "@emotion/styled";

import Breadcrumb from "react-bootstrap/Breadcrumb";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const StyledBreadcrumb = styled(Breadcrumb)({
  "> ol": {
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: `rgba(0, 0, 0, 0)`,
  },
  "@media(max-width: 767.98px)": {
    "> ol": {
      padding: 0,
      marginTop: `0.5rem`,
    }
  }
});

const Breadcrumbs = ({ breadcrumbs, current }) => (
  <StyledBreadcrumb>
    {breadcrumbs.map((bc, i) => (
      <li className="breadcrumb-item" key={bc.slug}>
        <OverlayTrigger
          key={bc.slug}
          placement="bottom"
          overlay={<Tooltip>{bc.heading}</Tooltip>}
        >
          <Link to={bc.slug}>
            {i === 0 ? `U.S. Code ` : ``}
            {bc.humanLevel} {bc.number}
          </Link>
        </OverlayTrigger>
      </li>
    ))}
    <li className="breadcrumb-item active" aria-current="page">
      <span className="active">
        {breadcrumbs.length === 0 ? `U.S. Code ` : ``}
        {current.humanLevel} {current.number}
      </span>
    </li>
  </StyledBreadcrumb>
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
