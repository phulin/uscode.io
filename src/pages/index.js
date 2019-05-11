import React from "react";
import PropTypes from "prop-types";
import { graphql, Link } from "gatsby";

import sortBy from "lodash/sortBy";

import Layout from "../components/layout";
import SEO from "../components/seo";

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" keywords={[`uscode`, `usc`, `statute`, `law`]} />
    <h3 css={{ marginTop: `0.5rem` }}>a minimalist website for the US Code</h3>
    <p>
      This site is meant to be easy to link to (<i>e.g.</i>
      {` `}
      <Link to="/26/1">uscode.io/26/1</Link>) and easy to read.{` `}
      No ads or tracking. It is not really intended for heavy-duty legal
      research.
    </p>
    <p>Browse:</p>
    <ul>
      {sortBy(data.titles.nodes, t => parseInt(t.number)).map(
        ({ number, heading, slug }) => (
          <li key={slug}>
            <Link to={slug}>
              Title {number}: {heading}
            </Link>
          </li>
        )
      )}
    </ul>
    <p>Keyboard shortcuts: in progress.</p>
    <p>Search functionality: maybe someday.</p>
  </Layout>
);

IndexPage.propTypes = {
  data: PropTypes.object.isRequired,
  "data.titles": PropTypes.object.isRequired,
  "data.titles.nodes": PropTypes.array.isRequired,
};

export default IndexPage;

export const query = graphql`
  query {
    titles: allUscSectionGroup(filter: { level: { eq: "title" } }) {
      nodes {
        number
        slug
        heading
      }
    }
  }
`;
