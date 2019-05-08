import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Section from "../components/section";

const SectionPage = ({ data }) => (
  <Layout>
    <Section {...data.section} />
  </Layout>
);

SectionPage.propTypes = {
  data: PropTypes.object,
  "data.section": PropTypes.object,
};

export default SectionPage;

export const query = graphql`
  query($section: String!) {
    section: uscSection(id: { eq: $section }) {
      shortSlug
      heading
      number
      contentsString: contents
      breadcrumbs {
        heading
        humanLevel
        number
        slug
      }
    }
  }
`;
