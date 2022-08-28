import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useLocation } from "@reach/router";
import { useStaticQuery, graphql } from "gatsby";

const SEO = ({ title, description, image, article }) => {
  const { pathname } = useLocation();
  const { site } = useStaticQuery(query);

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    defaultImage,
    author,
    siteName
  } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`
  };

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
    </Helmet>
  );
};

export default SEO;

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool
};

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false
};

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
`;
