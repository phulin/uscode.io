import React from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";

import flatMap from "lodash/flatMap";
import zip from "lodash/zip";

import { SectionContext } from "./section";

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

const TextFragment = ({ type, text, groups }) => {
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

TextFragment.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  groups: PropTypes.object,
};

const Text = ({ children }) => {
  const withRefs = addRefs(children);
  return withRefs.map(obj => (
    <TextFragment key={`${obj.type}-${obj.index}`} {...obj} />
  ));
}

Text.propTypes = {
  children: PropTypes.string.isRequired,
};

Text.Fragment = TextFragment;

export default Text;
