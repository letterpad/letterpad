import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import React from "react";

const getMetaTags = ({
  title,
  description,
  path,
  contentType,
  published,
  updated,
  category,
  tags,
  twitter,
  image,
  settings,
}) => {
  const metaTags = [
    { itemprop: "name", content: title },
    { itemprop: "description", content: description },
    { itemprop: "image", content: image },
    { name: "description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: `@${settings.social_twitter.value}` },
    { name: "twitter:title", content: `${title}` },
    { name: "twitter:description", content: description },
    {
      name: "twitter:creator",
      content: twitter || `@${settings.social_twitter.value}`,
    },
    { name: "twitter:image:src", content: image },
    { name: "og:title", content: `${title}` },
    { name: "og:type", content: contentType },
    { name: "og:url", content: path },
    { name: "og:image", content: image },
    { name: "og:description", content: description },
    { name: "og:site_name", content: settings.site_title.value },
  ];

  if (published)
    metaTags.push({ name: "article:published_time", content: published });
  if (updated)
    metaTags.push({ name: "article:modified_time", content: updated });
  if (category) metaTags.push({ name: "article:section", content: category });
  if (tags) metaTags.push({ name: "article:tag", content: tags });

  return metaTags;
};

const SEO = props => (
  <Helmet
    htmlAttributes={{
      lang: "en",
      itemscope: undefined,
      itemtype: `http://schema.org/${props.schema}`,
    }}
    title={props.title}
    link={[{ rel: "canonical", href: props.path }]}
    meta={getMetaTags({ ...props })}
  />
);

SEO.propTypes = {
  schema: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  contentType: PropTypes.string,
  published: PropTypes.string,
  updated: PropTypes.string,
  category: PropTypes.string,
  tags: PropTypes.array,
  twitter: PropTypes.string,
  image: PropTypes.string,
  settings: PropTypes.object,
};

export default SEO;
