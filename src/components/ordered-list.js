import isPropValid from "@emotion/is-prop-valid";
import styled from "@emotion/styled";

const OrderedList = styled.ol({
  listStyle: `none`,
  display: `inline-block`,
  verticalAlign: `top`,
  marginBottom: `-0.5rem`,
  marginTop: 0,
});

OrderedList.Item = styled(`li`, {
  shouldForwardProp: prop => isPropValid(prop) || prop === `seq`,
})({
  marginBottom: `0.5rem`,
  "&:before": {
    content: `attr(seq) "  "`,
    display: `inline-block`,
    width: `4rem`,
    marginLeft: `-4rem`,
    textAlign: `right`,
    whiteSpace: `pre`,
    verticalAlign: `top`,
  },
});

export default OrderedList;
