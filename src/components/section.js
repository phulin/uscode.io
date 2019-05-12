import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import styled from "@emotion/styled";

import Table from "react-bootstrap/Table";

import Anchor from "./anchor";
import OrderedList from "./ordered-list";
import PageHeading from "./page-heading";
import Text from "./text";

export const SectionContext = React.createContext({});

const Chapeau = styled.p({
  marginBottom: `0.5rem`,
});

const Heading = styled(Chapeau)({
  fontWeight: `bold`,
});

const FullDiv = styled.div({
  width: `100%`,
});

const MarginDiv = styled(FullDiv)({
  marginTop: `0.5rem`,
  "+ ol": {
    marginTop: 0,
  },
});

const textLevels = new Set([
  `subsection`,
  `paragraph`,
  `subparagraph`,
  `clause`,
  `subclause`,
  `item`,
  `subitem`,
  `subsubitem`,
]);

const SectionTable = ({ ...props }) => (
  <Table
    css={{
      width: `auto !important`,
      maxWidth: `calc(100% - 80px) !important`,
      margin: `0.5rem 40px 0`,
    }}
    bordered
    size="sm"
    {...props}
  />
);

const SourceCredit = props => (
  <MarginDiv>
    <small {...props} />
  </MarginDiv>
);

const Note = ({ heading, ...props }) => (
  <MarginDiv>
    <h6>{heading.text}</h6>
    <small {...props} />
  </MarginDiv>
);

const tagMap = new Map(
  Object.entries({
    p: FullDiv,
    chapeau: Chapeau,
    date: `span`,
    content: `span`,
    table: SectionTable,
    continuation: MarginDiv,
    sourceCredit: SourceCredit,
    quotedContent: MarginDiv,
  })
);

const literalTags = new Set([
  `table`,
  `colgroup`,
  `col`,
  `thead`,
  `tbody`,
  `tr`,
  `th`,
  `td`,
]);

const trimTags = new Set([`chapeau`, `content`]);
const Content = ({ node }) => {
  if (node.type === `text`) {
    return <Text>{node.text}</Text>;
  }

  // Group text levels into arrays so we can surround relevant tags with a list tag.
  const groupedChildren = [];
  for (const child of node.childNodes) {
    const last = groupedChildren
      ? groupedChildren[groupedChildren.length - 1]
      : [];
    if (textLevels.has(child.name)) {
      if (last && Array.isArray(last)) {
        last.push(child);
      } else {
        groupedChildren.push([child]);
      }
    } else {
      groupedChildren.push(child);
    }
  }

  // Hack to fix a data issue.
  let first = groupedChildren[0];
  if (trimTags.has(node.name) && first && first.type === `text`) {
    first.text = first.text.replace(/^\s+/, ``);
  }

  const childContent = groupedChildren.map((child, i) =>
    Array.isArray(child) ? (
      <OrderedList key={i}>
        {child.map((child2, j) => (
          <Content node={child2} key={j} />
        ))}
      </OrderedList>
    ) : (
      <Content node={child} key={i} />
    )
  );

  if (tagMap.has(node.name)) {
    const Tag = tagMap.get(node.name);
    return (
      <Tag className={`${node.name} ${node.attributes.class || ``}`}>
        {childContent}
      </Tag>
    );
  } else if (literalTags.has(node.name)) {
    const Tag = node.name;
    return <Tag>{childContent.length ? childContent : undefined}</Tag>;
  } else if (node.name === `ref` && node.attributes.href) {
    const href = node.attributes.href;
    const match = href.match(/\/us\/usc\/t([0-9]+)\/s([0-9a-zA-Z\-.]+)\/(.*)/);
    if (!match) {
      return <>{childContent}</>;
    }

    const [title, section, anchor] = match.slice(1);
    const link = `/${title}/${section}/#${anchor}`;
    return <Link to={link}>{node.text}</Link>;
  } else if (textLevels.has(node.name)) {
    let identifier = node.attributes.identifier;
    return (
      <SectionContext.Consumer>
        {({ title, section }) => {
          const name = identifier
            ? identifier.replace(`/us/usc/t${title}/s${section}/`, ``)
            : ``;
          const elements = name.split(`/`);
          const humanName = `(${elements.join(`)(`)})`;
          return (
            <OrderedList.Item seq={node.num.text}>
              {identifier ? (
                <Anchor name={name} className="text-muted">
                  {humanName}
                </Anchor>
              ) : (
                ``
              )}
              {node.heading ? (
                <Heading>
                  {node.heading.text ||
                    node.heading.childNodes.map((c, i) => (
                      <Content key={i} node={c} />
                    ))}
                </Heading>
              ) : (
                <></>
              )}
              {childContent}
            </OrderedList.Item>
          );
        }}
      </SectionContext.Consumer>
    );
  } else if (node.name === `note`) {
    return (
      <MarginDiv>
        <small>
          {node.heading ? <b>{node.heading.text}</b> : ``}
          {childContent}
        </small>
      </MarginDiv>
    );
  } else {
    return <>{childContent}</>;
  }
};

Content.propTypes = {
  node: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string,
    childNodes: PropTypes.array,
  }),
};

const Section = ({ breadcrumbs, contents }) => {
  const sectionNumber = contents.num.attributes.value;
  return (
    <SectionContext.Provider
      value={{
        title: breadcrumbs[0].number,
        section: sectionNumber,
        breadcrumbs,
      }}
    >
      <PageHeading>
        <span className="d-none d-print-inline">
          {breadcrumbs[0].number} U.S.C.{" "}
        </span>
        {contents.num.text} {contents.heading.text}
      </PageHeading>
      <Content node={contents} />
    </SectionContext.Provider>
  );
};

Section.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  contents: PropTypes.object,
};

export default Section;
