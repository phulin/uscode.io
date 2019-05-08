import isPropValid from "@emotion/is-prop-valid";
import styled from "@emotion/styled";

const OrderedList = styled.ol({
  listStyle: `none`,
});

OrderedList.Item = styled(`li`, {
  shouldForwardProp: prop => isPropValid(prop) || prop === `seq`,
})({
  "&:before": {
    content: `attr(seq) " "`,
    display: `inline-block`,
    width: `4em`,
    marginLeft: `-4em`,
    textAlign: `right`,
    whiteSpace: `pre`,
  },
});

export default OrderedList;
