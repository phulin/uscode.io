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
const levels = [
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

    const slug =
      breadcrumbs.map(bc => `/${bc.level}-${bc.number}`).join(``) +
      `/${level}-${number}`;

    const node = {
      identifier,
      level,
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

    const sections = levels
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

    const node = {
      identifier,
      title: this.title,
      number,
      heading,
      notes: [],
      breadcrumbs: breadcrumbs.map(bc => bc),
      shortSlug: `/${this.title}/${number}`,
      slug: `${parent.slug}/section-${number}`,
      id: this.createNodeId(`${parent.id} >>> Section ${number}`),
      parent: parent.id,
      children: [],
      internal: {
        contentDigest: this.createContentDigest(section.toString()),
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

  const sectionGroupPage = path.resolve(__dirname, `src/templates/section-group-page.js`);
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
          shortSlug
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
    createPage({
      path: node.shortSlug,
      component: sectionPage,
      context: {
        section: node.id,
      },
    });
  });
};
