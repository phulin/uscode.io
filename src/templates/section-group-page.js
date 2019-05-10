import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";

import Breadcrumbs from "../components/breadcrumbs";
import Layout from "../components/layout";
import PageHeading from "../components/page-heading";
import SectionOrGroup from "../components/section-or-group";

const SectionGroupPage = ({ data }) => {
  const { humanLevel, number, heading, breadcrumbs, childNodes } = data.group;
  return (
    <Layout
      title={`${humanLevel} ${number}: ${heading}`}
      breadcrumbs={
        <Breadcrumbs breadcrumbs={breadcrumbs} current={{ humanLevel, number }} />
      }
    >
      <PageHeading>
        {humanLevel} {number}: {heading}
      </PageHeading>
      {childNodes.map((child, i) => (
        <div key={i}>
          <SectionOrGroup linkAs="h4" {...child} />
        </div>
      ))}
    </Layout>
  );
};

SectionGroupPage.propTypes = {
  data: PropTypes.shape({
    group: PropTypes.shape({
      humanLevel: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      heading: PropTypes.string.isRequired,
      breadcrumbs: PropTypes.arrayOf(
        PropTypes.shape({
          humanLevel: PropTypes.string.isRequired,
          number: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
        })
      ),
      childNodes: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
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
