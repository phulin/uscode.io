import styled from "@emotion/styled";

const Anchor = styled.a({
  position: `absolute`,
  left: `-8.5rem`,
  width: `8rem`,
  paddingTop: `0.1rem`,
  textAlign: `right`,
  fontSize: `smaller`,
  userSelect: `none`,

  "& + ol > li:first-of-type > div > a": {
    display: `none`,
  },

  "@media (max-width: 767.98px)": {
    display: `none`,
  },

  /*".container:hover &": {
    visibility: `hidden`,
  },*/

  ":hover": {
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
