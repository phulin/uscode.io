import React from "react";
import PropTypes from "prop-types";

import styled from "@emotion/styled";

import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import RBNavbar from "react-bootstrap/Navbar";

const SmallButton = props => (
  <Button size="sm" {...props}>
    {props.children}
  </Button>
);

SmallButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const SmallTogglerButton = styled(SmallButton)({
  ".navbar-toggler-icon": {
    padding: `0px`,
    height: `1.25rem`,
    width: `1.25rem`,
  },
});

const StyledRBNavbar = styled(RBNavbar)({
  padding: `0.5rem 1rem !important`,
  "@media (max-width: 767.98px)": {
    margin: `0 -10px`,
  },
});

const Navbar = ({ breadcrumbs, navs, nightMode, onToggleNightMode }) => (
  <StyledRBNavbar bg="light" expand="md">
    <RBNavbar.Brand className={breadcrumbs ? `d-md-none` : ``}>
      uscode.io
    </RBNavbar.Brand>
    <RBNavbar.Toggle
      as={SmallTogglerButton}
      aria-controls="response-navbar-nav"
    />
    <RBNavbar.Collapse id="responsive-navbar-nav">
      {breadcrumbs}
      <Nav className="ml-auto">
        {Object.entries(navs).map(([k, v]) => (
          <Nav.Link key={v} href={v}>
            {k}
          </Nav.Link>
        ))}
        <Nav.Link onClick={onToggleNightMode}>
          {nightMode ? "Day Mode" : "Night Mode"}
        </Nav.Link>
      </Nav>
    </RBNavbar.Collapse>
  </StyledRBNavbar>
);

Navbar.propTypes = {
  breadcrumbs: PropTypes.node.isRequired,
  navs: PropTypes.object,
  onToggleNightMode: PropTypes.func.isRequired,
  nightMode: PropTypes.bool.isRequired,
};

Navbar.defaultProps = {
  navs: {},
};

export default Navbar;
