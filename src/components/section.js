import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import styled from "@emotion/styled";

import Anchor from "./anchor";
import OrderedList from "./ordered-list";
import PageHeading from "./page-heading";
import Text from "./text";

export const SectionContext = React.createContext({});

const Chapeau = styled.div({
  display: `inline-block`,
  marginBottom: `0.5rem`,
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

const tagMap = new Map(
  Object.entries({
    p: `p`,
    note: `p`,
    chapeau: Chapeau,
    date: `span`,
    content: `span`,
  })
);

const hiddenTags = new Set([`note`]);

const trimTags = new Set([`chapeau`, `content`]);
const Content = ({ node }) => {
  if (node.type == `text`) {
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
    const style = hiddenTags.has(node.name) ? { display: `none` } : {};
    return (
      <Tag
        className={`${node.name} ${node.attributes.class || ``}`}
        style={style}
      >
        {childContent}
      </Tag>
    );
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
          const name = identifier.replace(`/us/usc/t${title}/s${section}/`, ``);
          const elements = name.split(`/`);
          const humanName = `(${elements.join(`)(`)})`;
          return (
            <OrderedList.Item seq={node.num.text}>
              <Anchor name={name} className="text-muted">{humanName}</Anchor>
              {node.heading ? <span>{node.heading.text}</span> : <></>}
              {childContent}
            </OrderedList.Item>
          );
        }}
      </SectionContext.Consumer>
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
        {contents.num.text} {contents.heading.text}
      </PageHeading>
      <Content node={contents} />
    </SectionContext.Provider>
  );
}

Section.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
  contents: PropTypes.object,
};

export default Section;
