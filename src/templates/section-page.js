import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Breadcrumbs from "../components/breadcrumbs";
import Layout from "../components/layout";
import Section from "../components/section";
import SEO from "../components/seo";

const SectionPage = ({ data }) => {
  const section = data.section;
  const contents = JSON.parse(section.contentsString);
  const sectionNumber = contents.num.attributes.value;
  const currentBreadcrumb = {
    humanLevel: `Section`,
    number: sectionNumber,
  };
  const breadcrumbs = section.breadcrumbs;
  const title = breadcrumbs[0];
  const cite = `${title.number} U.S.C. § ${section.number}`;
  const pageTitle = `${cite}: ${section.heading}`;
  return (
    <Layout breadcrumbs={
      <Breadcrumbs breadcrumbs={breadcrumbs} current={currentBreadcrumb} />
    }>
      <SEO
        title={pageTitle}
        keywords={[`uscode`, `usc`, `statute`, `law`, cite, section.heading]}
        description={
          `United States Code, Title ${title.number}, ` +
          `Section ${section.number}: ${section.heading}`
        }
      />
      <Section contents={contents} {...data.section} />
    </Layout>
  );
};

SectionPage.propTypes = {
  data: PropTypes.shape({
    section: PropTypes.shape(Section.propTypes),
  }),
};

export default SectionPage;

export const query = graphql`
  query($section: String!) {
    section: uscSection(id: { eq: $section }) {
      slug
      heading
      number
      contentsString: contents
      breadcrumbs {
        heading
        level
        humanLevel
        number
        slug
      }
    }
  }
`;
