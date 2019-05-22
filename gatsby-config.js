module.exports = {
  siteMetadata: {
    title: `uscode.io`,
    description: `Minimalist and (hopefully) beautiful US Code viewer.`,
    author: `Patrick Hulin`,
    siteUrl: `https://uscode.io`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `uscode.io`,
        short_name: `uscode.io`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/icon.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `xml`,
        path: `${__dirname}/src/xml`,
      },
    },
    `gatsby-plugin-emotion`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        policy: [{
          userAgent: `*`,
          allow: `/`,
          crawlDelay: 10,
        }],
      },
    },
    `gatsby-plugin-netlify`,
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        develop: true,
        whitelistPatterns: [/^nav-/, /^navbar-/, /^bg-/, /^oi-document$/],
      },
    },
  ],
}
