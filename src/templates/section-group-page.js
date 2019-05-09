import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SectionOrGroup from "../components/section-or-group";

const SectionGroupPage = ({ data }) => {
  const { humanLevel, number, heading } = data.group;
  return (
    <Layout title={`${humanLevel} ${number}: ${heading}`}>
      <SectionOrGroup withLink={false} {...data.group} />
    </Layout>
  );
}

SectionGroupPage.propTypes = {
  data: PropTypes.shape({
    group: PropTypes.object.isRequired,
  }).isRequired,
  //"data.group": PropTypes.object.isRequired,
};

export default SectionGroupPage;

/* This query is disgusting because GraphQL can't do arbitrary-depth queries.
 * So we go to as much depth as we expect.
 */
export const query = graphql`
  fragment sectionFields on USCSection {
    __typename
    slug
    heading
    number
  }

  fragment sectionGroupFields on USCSectionGroup {
    __typename
    slug
    humanLevel
    number
    heading
  }

  query($sectionGroup: String!) {
    group: uscSectionGroup(id: { eq: $sectionGroup }) {
      ...sectionGroupFields
      breadcrumbs {
        heading
        level
        humanLevel
        number
        slug
      }
      childNodes: children {
        ...sectionFields
        ...sectionGroupFields
        ... on USCSectionGroup {
          childNodes: children {
            ...sectionFields
            ...sectionGroupFields
            ... on USCSectionGroup {
              childNodes: children {
                ...sectionFields
                ...sectionGroupFields
                ... on USCSectionGroup {
                  childNodes: children {
                    ...sectionFields
                    ...sectionGroupFields
                    ... on USCSectionGroup {
                      childNodes: children {
                        ...sectionFields
                        ...sectionGroupFields
                        ... on USCSectionGroup {
                          childNodes: children {
                            ...sectionFields
                            ...sectionGroupFields
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
