import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import Section from "../components/section";
import SEO from "../components/seo";

const SectionPage = ({ data }) => {
  const section = data.section;
  const title = section.breadcrumbs[0];
  const cite = `${title.number} U.S.C. § ${section.number}`;
  const pageTitle = `${cite}: ${section.heading}`;
  return (
    <Layout>
      <SEO
        title={pageTitle}
        keywords={[`uscode`, `usc`, `statute`, `law`, cite, section.heading]}
        description={
          `United States Code, Title ${title.number}, ` +
          `Section ${section.number}: ${section.heading}`
        }
      />
      <Section {...data.section} />
    </Layout>
  );
};

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
