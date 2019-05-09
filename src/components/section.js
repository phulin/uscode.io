import React from "react";
import PropTypes from "prop-types";

import styled from "@emotion/styled";

import Breadcrumbs from "./breadcrumbs";
import OrderedList from "./ordered-list";

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
    ref: `span`,
    date: `span`,
    content: `span`,
  })
);

const hiddenTags = new Set([`note`]);

const trimTags = new Set([`chapeau`, `content`]);

const Content = ({ node }) => {
  if (node.type == `text`) {
    return node.text;
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
    first.text = first.text.replace(/^\W+/, ``);
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
      <Tag className={`${node.name} ${node.attributes.class || ``}`} style={style}>
        {childContent}
      </Tag>
    );
  } else if (textLevels.has(node.name)) {
    return (
      <OrderedList.Item seq={node.num.text}>
        {node.heading ? <span>{node.heading.text}</span> : <></>}
        {childContent}
      </OrderedList.Item>
    );
  } else {
    return <>{childContent}</>;
  }
};

Content.propTypes = {
  node: PropTypes.object,
  "node.type": PropTypes.string,
  "node.text": PropTypes.string,
  "node.childNodes": PropTypes.array,
};

const Section = ({ breadcrumbs, contentsString }) => {
  const contents = JSON.parse(contentsString);
  const currentBreadcrumb = {
    humanLevel: `Section`,
    number: contents.num.attributes.value,
  };
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} current={currentBreadcrumb}/>
      <h1>{contents.num.text} {contents.heading.text}</h1>
      <Content node={contents} />
    </>
  );
};

Section.propTypes = {
  heading: PropTypes.string,
  number: PropTypes.string,
  breadcrumbs: PropTypes.array,
  contentsString: PropTypes.string,
};

export default Section;
