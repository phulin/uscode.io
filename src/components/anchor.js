import styled from "@emotion/styled";

const Anchor = styled.a({
  position: `absolute`,
  left: `-8.5rem`,
  width: `8rem`,
  paddingTop: `0.1rem`,
  textAlign: `right`,
  fontSize: `smaller`,
  userSelect: `none`,
  visibility: `hidden`,

  "& + ol > li:first-of-type > div > a": {
    display: `none`,
  },

  "@media (max-width: 767.98px)": {
    display: `none`,
  },

  "div[data-hover-hide-links]:hover + .container &": {
    visibility: `visible !important`,
  },

  ":hover ~ ol a[name]": {
    visibility: `visible !important`,
  },

  "& ~ span": {
    visibility: `visible !important`,
  },
});

export default Anchor;
