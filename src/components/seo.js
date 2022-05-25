import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

const SEO = ({ title, description, image, article }) => {
  const { pathname } = useLocation()
  const { site } = useStaticQuery(query)

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    defaultImage,
    author,
    siteName
  } = site.siteMetadata

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  }

  return (
    <Helmet title={seo.title} htmlAttributes={{ lang: "en" }}>
      
      {seo.title && <meta property="og:title" content={seo.title} />}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:site_name" content={siteName} />
      {author && <meta name="author" content={author} />}
      {seo.url && <meta property="og:url" content={seo.url} />}
      
      <meta name="description" content={seo.description} />
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}

      <meta name="image" content={seo.image} />
      {seo.image && <meta property="og:image" content={seo.image} />}

      <meta name="twitter:card" content="summary_large_image" />
      {author && <meta name="twitter:creator" content={author} />}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      {seo.image && <meta name="twitter:image:alt" content={seo.description} />}
      <meta name="twitter:site" content={siteName} />
      <meta name="twitter:url" content={seo.url} />
      <link rel="apple-touch-icon-precomposed" sizes="57x57" href="favicon/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon-precomposed" sizes="114x114" href="favicon/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="favicon/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href="favicon/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon-precomposed" sizes="60x60" href="favicon/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon-precomposed" sizes="120x120" href="favicon/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon-precomposed" sizes="76x76" href="favicon/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon-precomposed" sizes="152x152" href="favicon/apple-touch-icon-152x152.png" />
      <link rel="icon" type="image/png" href="favicon/favicon-196x196.png" sizes="196x196" />
      <link rel="icon" type="image/png" href="favicon/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/png" href="favicon/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="favicon/favicon-16x16.png" sizes="16x16" />
      <link rel="icon" type="image/png" href="favicon/favicon-128.png" sizes="128x128" />
      <meta name="application-name" content="&nbsp;"/>
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      <meta name="msapplication-TileImage" content="favicon/mstile-144x144.png" />
      <meta name="msapplication-square70x70logo" content="favicon/mstile-70x70.png" />
      <meta name="msapplication-square150x150logo" content="favicon/mstile-150x150.png" />
      <meta name="msapplication-wide310x150logo" content="favicon/mstile-310x150.png" />
      <meta name="msapplication-square310x310logo" content="favicon/mstile-310x310.png" />

    </Helmet>
  )
}

export default SEO

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
}

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
}

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        siteUrl: url
        defaultImage: image
        author
      }
    }
  }
`
