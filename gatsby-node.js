const fs = require(`fs`);
const libxml = require(`libxmljs`);
const path = require(`path`);
const util = require(`util`);

exports.sourceNodes = async function({ actions }) {
  const { createTypes } = actions;

  const schema = await util.promisify(fs.readFile)(
    path.resolve(__dirname, `schema.graphql`),
    { encoding: `utf-8` }
  );

  createTypes(schema);
};

const NS = { uslm: `http://xml.house.gov/schemas/uslm/1.0` };
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

Object.fromEntries = iterable =>
  [...iterable].reduce(
    (obj, { 0: key, 1: val }) => Object.assign(obj, { [key]: val }),
    {}
  );

function usml2json(node) {
  const type = node.type();
  if (type === `text`) {
    return {
      type: `text`,
      text: node.text(),
    };
  } else if (type === `element`) {
    const allChildren = node.childNodes().map(child => usml2json(child));

    // Remove all empty text nodes.
    const nonemptyChildren = allChildren.filter(
      child => child.type !== `text` || child.text.trim() !== ``
    );

    // Remove nodes like num/heading/notes.
    const nonContentTags = [`num`, `heading`, `notes`, `sourceCredit`];
    const children = nonemptyChildren.filter(
      child => child.type !== `element` || !nonContentTags.includes(child.name)
    );

    const result = {
      type: `element`,
      name: node.name(),
      childNodes: children,
      attributes: Object.fromEntries(
        node.attrs().map(attr => [attr.name(), attr.value()])
      ),
    };

    if (children.length === 1 && children[0].type === 'text') {
      result.text = children[0].text;
    }

    const elements = nonemptyChildren.filter(child => child.type === `element`);
    const grouped = new Map();
    for (const node of elements) {
      grouped.set(node.name, [...(grouped[node.name] || []), node]);
    }
    for (const [name, nodes] of grouped) {
      if (
        nodes.length > 0 && nonContentTags.includes(name)
      ) {
        result[name] = nodes[0];
      }
    }

    /* Ensure anything we lifted to root is no longer a child. */
    result.childNodes = result.childNodes.filter(c => result[c.name] === undefined);

    return result;
  } else {
    return { type: `error`, error: `Unrecognized node type.` };
  }
}

class Visitor {
  constructor(actions, createNodeId, createContentDigest) {
    this.actions = actions;
    this.createNode = actions.createNode;
    this.createParentChildLink = actions.createParentChildLink;
    this.createNodeId = createNodeId;
    this.createContentDigest = createContentDigest;
  }

  getHeading(element) {
    let heading = element.get(`.//uslm:heading`, NS);
    return heading.text().trim();
  }

  visit(parent, doc) {
    const node = {
      publicationName: doc.get(`//uslm:docPublicationName`, NS).text(),
      id: this.createNodeId(`${parent.id} >>> XML`),
      parent: parent.id,
      children: [],
      internal: {
        contentDigest: this.createContentDigest(doc.toString()),
        type: `USCFile`,
      },
    };

    this.createNode(node);
    this.createParentChildLink({ parent, child: node });

    const title = doc.get(`//uslm:title`, NS);
    const number = title.get(`.//uslm:num/@value`, NS).value();
    this.title = number;
    this.visitSectionGroup(node, title, []);
    delete this.title;
  }

  visitSectionGroup(parent, group, breadcrumbs) {
    const number = group.get(`.//uslm:num/@value`, NS).value();
    const heading = this.getHeading(group);
    const identifier = group.attr(`identifier`).value();
    const level = group.name();
    const humanLevel = `${level.charAt(0).toUpperCase()}${level.slice(1)}`;

    const slug =
      breadcrumbs.map(bc => `/${bc.level}-${bc.number}`).join(``) +
      `/${level}-${number}`;

    const node = {
      identifier,
      level,
      humanLevel,
      number,
      heading,
      notes: [],
      breadcrumbs: breadcrumbs.map(bc => bc),
      slug: slug,
      id: this.createNodeId(`${parent.id} >>> ${slug}`),
      parent: parent.id,
      children: [],
      internal: {
        contentDigest: this.createContentDigest(group.toString()),
        type: `USCSectionGroup`,
      },
    };

    this.createNode(node);
    this.createParentChildLink({ parent, child: node });

    const newBreadcrumbs = [...breadcrumbs, node];

    const sections = groupLevels
      .map(level =>
        group
          .find(`./uslm:${level}`, NS)
          .map(child => this.visitSectionGroup(node, child, newBreadcrumbs))
      )
      .flat(2)
      .concat(
        group
          .find(`./uslm:section`, NS)
          .map(section => this.visitSection(section, newBreadcrumbs))
      );

    return sections;
  }

  visitSection(section, breadcrumbs) {
    const parent = breadcrumbs[breadcrumbs.length - 1];

    const number = section.get(`.//uslm:num/@value`, NS).value();
    const heading = this.getHeading(section);
    const identifier = section.attr(`identifier`).value();

    const xml = section.toString();

    const node = {
      identifier,
      title: this.title,
      number,
      heading,
      notes: [],
      breadcrumbs: breadcrumbs.map(bc => bc),
      slug: `/${this.title}/${number}`,
      contents: JSON.stringify(usml2json(section)),
      id: this.createNodeId(`${parent.id} >>> Section ${number}`),
      parent: parent.id,
      children: [],
      internal: {
        contentDigest: this.createContentDigest(xml),
        type: `USCSection`,
      },
    };

    this.createNode(node);
    this.createParentChildLink({ parent, child: node });

    return node;
  }
}

exports.onCreateNode = async function({
  node,
  actions,
  loadNodeContent,
  createNodeId,
  createContentDigest,
}) {
  // We only care about XML content.
  if (![`application/xml`, `text/xml`].includes(node.internal.mediaType)) {
    return;
  }

  const rawXml = await loadNodeContent(node);
  const doc = libxml.parseXmlString(rawXml);

  const visitor = new Visitor(actions, createNodeId, createContentDigest);
  visitor.visit(node, doc);
};

exports.createPages = async function({ graphql, actions }) {
  const { createPage } = actions;

  const sectionGroupPage = path.resolve(
    __dirname,
    `src/templates/section-group-page.js`
  );
  const sectionPage = path.resolve(__dirname, `src/templates/section-page.js`);

  const sectionGroups = await graphql(`
    {
      allUscSectionGroup {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (sectionGroups.errors) {
    console.error(sectionGroups.errors);
    return;
  }

  sectionGroups.data.allUscSectionGroup.nodes.forEach(node => {
    createPage({
      path: node.slug,
      component: sectionGroupPage,
      context: {
        sectionGroup: node.id,
      },
    });
  });

  const sections = await graphql(`
    {
      allUscSection {
        nodes {
          id
          slug
        }
      }
    }
  `);

  if (sections.errors) {
    console.error(sections.errors);
    return;
  }

  sections.data.allUscSection.nodes.forEach(node => {
    createPage({
      path: node.slug,
      component: sectionPage,
      context: {
        section: node.id,
      },
    });
  });
};
