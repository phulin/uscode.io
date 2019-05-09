import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import styled from "@emotion/styled";
import flatMap from "lodash/flatMap";
import zip from "lodash/zip";

import Breadcrumbs from "./breadcrumbs";
import OrderedList from "./ordered-list";

const SectionContext = React.createContext({});

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

const groupLevels = [
  `title`,
  `subtitle`,
  `part`,
  `subpart`,
  `division`,
  `subdivision`,
  `chapter`,
  `subchapter`,
  `article`,
  `subarticle`,
];

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

const spliceRegexOne = (node, regex, type, groupNames) => {
  let match = regex.exec(node.text);
  const matches = [];
  while (match !== null) {
    matches.push(match);
    match = regex.exec(node.text);
  }
  const matched = matches.map(m => ({
    type,
    text: m[0],
    index: node.index + m.index,
    groups: Object.fromEntries(zip(groupNames, m.slice(1))),
  }));
  const unmatchedStarts = [0].concat(matches.map(m => m.index + m[0].length));
  const unmatchedEnds = matches.map(m => m.index).concat(node.text.length);
  const unmatched = zip(unmatchedStarts, unmatchedEnds).map(([start, end]) => ({
    type: `text`,
    text: node.text.slice(start, end),
    index: node.index + start,
  }));
  const result = zip(unmatched, matched).flat(1);
  return result.slice(0, result.length - 1);
};

const spliceRegexAll = (nodeList, regex, type, groups) =>
  flatMap(nodeList, node =>
    node.type === `text` ? spliceRegexOne(node, regex, type, groups) : node
  );

const addRefs = text => {
  let nodeList = [{ type: `text`, text, index: 0 }];

  const sectionRegex = /section\s([0-9]+)(\(\w+\))*(?=[^\w\-()])(?! of the)( of this title)?/gi;
  nodeList = spliceRegexAll(nodeList, sectionRegex, `ref-section`, [`section`]);

  const levelsRegex = new RegExp(`this (${groupLevels.join("|")})`, `gi`);
  nodeList = spliceRegexAll(nodeList, levelsRegex, `ref-group`, [`level`]);

  return nodeList;
};

const Fragment = ({ type, text, groups }) => {
  if (type === `text`) {
    return text;
  } else if (type === `ref-group`) {
    const level = groups.level;
    // eslint-disable-next-line react/prop-types
    const consumer = ({ breadcrumbs }) => {
      const breadcrumb = breadcrumbs.find(bc => bc.level === level);
      return breadcrumb ? <Link to={breadcrumb.slug}>{text}</Link> : text;
    };
    return <SectionContext.Consumer>{consumer}</SectionContext.Consumer>;
  } else if (type === `ref-section`) {
    return (
      <SectionContext.Consumer>
        {({ title }) => <Link to={`/${title}/${groups.section}`}>{text}</Link>}
      </SectionContext.Consumer>
    );
  }
};

Fragment.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  groups: PropTypes.object,
};

const Text = ({ children }) => {
  const withRefs = addRefs(children);
  return withRefs.map(obj => (
    <Fragment key={`${obj.type}-${obj.index}`} {...obj} />
  ));
};

Text.propTypes = {
  children: PropTypes.string.isRequired,
};

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
      <>
        <SectionContext.Consumer>
          {({ title, section }) => (
            <a
              name={identifier.replace(`/us/usc/t${title}/s${section}/`, ``)}
            />
          )}
        </SectionContext.Consumer>
        <OrderedList.Item seq={node.num.text}>
          {node.heading ? <span>{node.heading.text}</span> : <></>}
          {childContent}
        </OrderedList.Item>
      </>
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

const Section = ({ breadcrumbs, contentsString }) => {
  const contents = JSON.parse(contentsString);
  const sectionNumber = contents.num.attributes.value;
  const currentBreadcrumb = {
    humanLevel: `Section`,
    number: sectionNumber,
  };
  return (
    <SectionContext.Provider
      value={{
        title: breadcrumbs[0].number,
        section: sectionNumber,
        breadcrumbs,
      }}
    >
      <Breadcrumbs breadcrumbs={breadcrumbs} current={currentBreadcrumb} />
      <h2>
        {contents.num.text} {contents.heading.text}
      </h2>
      <Content node={contents} />
    </SectionContext.Provider>
  );
};

Section.propTypes = {
  heading: PropTypes.string,
  number: PropTypes.string,
  breadcrumbs: PropTypes.array,
  contentsString: PropTypes.string,
};

export default Section;
