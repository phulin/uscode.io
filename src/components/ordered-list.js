import isPropValid from "@emotion/is-prop-valid";
import styled from "@emotion/styled";

const OrderedList = styled.ol({
  listStyle: `none`,
  display: `inline-block`,
  verticalAlign: `top`,
  marginBottom: `-0.5rem`,
  marginTop: 0,
  "@media (max-width: 767.98px)": {
    paddingInlineStart: `20px`,
  },
});

OrderedList.Item = styled(`li`, {
  shouldForwardProp: prop => isPropValid(prop) || prop === `seq`,
})({
  marginBottom: `0.5rem`,
  "&:before": {
    content: `attr(seq)`,
    display: `inline-block`,
    width: `4rem`,
    marginLeft: `-4rem`,
    paddingRight: `0.5rem`,
    textAlign: `right`,
    whiteSpace: `pre`,
    verticalAlign: `top`,
  },
  "@media (max-width: 767.98px)": {
    "&:before": {
      paddingRight: `0.2rem`,
      fontSize: `smaller`,
      position: `relative`,
      top: `0.1rem`,
    },
  },
});

export default OrderedList;
