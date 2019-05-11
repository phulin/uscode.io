import React from "react";
import PropTypes from "prop-types";

import styled from "@emotion/styled";

const OrderedList = styled.ol({
  listStyle: `none`,
  display: `block`,
  width: `100%`,
  marginBottom: `-0.5rem`,
  marginTop: 0,
  paddingInlineStart: 0,
  "@media (max-width: 767.98px)": {
    paddingInlineStart: 0, // `20px`,
  },
  "& + .text": {
    marginTop: `0.5rem`,
  },
  "continuation + &": {
    marginTop: `0.5rem`,
  },
});

const StyledLi = styled.li({
  display: `flex`,
  alignItems: `flex-start`,
  paddingBottom: `0.5rem`,
  "> .numeral": {
    flexShrink: 0,
    textAlign: `right`,
    whiteSpace: `nowrap`,
    width: `40px`,
    paddingRight: `0.4rem`,
  },
  "> .li-content": {
    width: `100%`,
  },
  "@media (max-width: 767.98px)": {
    "> .numeral": {
      width: `20px`,
      paddingRight: `0.2rem`,
      fontSize: `smaller`,
      position: `relative`,
      top: `0.15rem`,
    },
  },
});

const OrderedListItem = ({ seq, children }) => (
  <StyledLi>
    <div className="numeral">
      {seq}
    </div>
    <div className="li-content">{children}</div>
  </StyledLi>
);

OrderedListItem.propTypes = {
  seq: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

OrderedList.Item = OrderedListItem;

export default OrderedList;
