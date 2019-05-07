import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SectionOrGroup from "../components/section-or-group";

const SectionGroupPage = ({ data }) => (
  <Layout>
    <SectionOrGroup {...data.group} />
  </Layout>
);

SectionGroupPage.propTypes = {
  data: PropTypes.object,
  "data.group": PropTypes.object,
};

export default SectionGroupPage;

export const query = graphql`
  fragment sectionSlug on USCSection {
    __typename
    shortSlug
    heading
    number
  }

  fragment sectionGroupSlug on USCSectionGroup {
    __typename
    slug
    level
    number
    heading
  }

  query($sectionGroup: String!) {
    group: uscSectionGroup(id: { eq: $sectionGroup }) {
      ...sectionGroupSlug
      breadcrumbs {
        heading
        level
        number
      }
      childNodes: children {
        ...sectionSlug
        ...sectionGroupSlug
        ... on USCSectionGroup {
          childNodes: children {
            ...sectionSlug
            ...sectionGroupSlug
            ... on USCSectionGroup {
              childNodes: children {
                ...sectionSlug
                ...sectionGroupSlug
                ... on USCSectionGroup {
                  childNodes: children {
                    ...sectionSlug
                    ...sectionGroupSlug
                    ... on USCSectionGroup {
                      childNodes: children {
                        ...sectionSlug
                        ...sectionGroupSlug
                        ... on USCSectionGroup {
                          childNodes: children {
                            ...sectionSlug
                            ...sectionGroupSlug
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
