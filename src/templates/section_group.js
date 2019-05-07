import React from "react"; // eslint-disable-line no-unused-vars
import { graphql } from "gatsby";

const SectionOrGroup = ({ contents }) => {
  return contents.children ? <>
    <h1>{contents.level} {contents.number}: {contents.heading}</h1>
    <ul>
      {contents.children.map((child, i) => (
        <li key={i}>
          <SectionOrGroup contents={child} />
        </li>
      ))}
    </ul>
  </> : (
    <h2>Section {contents.number}: {contents.heading}</h2>
  );
}

export default ({ data }) => <SectionOrGroup contents={data.group} />;

export const query = graphql`
  fragment sectionSlug on USCSection {
    __typename
    slug
    heading
    number
  }

  fragment sectionGroupSlug on USCSectionGroup {
    __typename
    level
    number
    heading
  }

  query($slug: String!) {
    group: uscSectionGroup(slug: { eq: $slug }) {
      ...sectionGroupSlug
      breadcrumbs {
        heading
        level
        number
      }
      children {
        ...sectionSlug
        ...sectionGroupSlug
        ... on USCSectionGroup {
          children {
            ...sectionSlug
            ...sectionGroupSlug
            ... on USCSectionGroup {
              children {
                ...sectionSlug
                ...sectionGroupSlug
                ... on USCSectionGroup {
                  children {
                    ...sectionSlug
                    ...sectionGroupSlug
                    ... on USCSectionGroup {
                      children {
                        ...sectionSlug
                        ...sectionGroupSlug
                        ... on USCSectionGroup {
                          children {
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
