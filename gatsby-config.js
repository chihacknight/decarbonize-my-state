module.exports = {
  siteMetadata: {
    title: `Who benefits from climate ambition?`,
    description: `What occupations benefit most from ambitious climate policy? Who holds these jobs today? Explore and compare nearly 600 occupations, including over 100 common green jobs.`,
    author: `Data for Progress + Kyle Gracey + Brittany Bennett`,
    url: `https://greenjobsdata.com`,
    image: `/socialcard.png`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: process.env.SENTRY_DSN ? process.env.SENTRY_DSN : "",
      }
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/final/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `files`,
        path: `${__dirname}/static/files`,
      },
    },
  ]
}
