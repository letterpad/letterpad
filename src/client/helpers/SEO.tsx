import React from "react";
import { Helmet } from "react-helmet";
import config from "../../config";

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
  const host = settings.site_url.value;
  const metaTags = [
    { itemprop: "name", content: title },
    { itemprop: "description", content: description },
    { itemprop: "image", content: host + image },
    { name: "description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: `@${settings.social_twitter.value}` },
    { name: "twitter:title", content: `${title}` },
    { name: "twitter:description", content: description },
    {
      name: "twitter:creator",
      content: twitter || `@${settings.social_twitter.value}`,
    },
    { name: "twitter:image:src", content: host + image },
    { name: "og:title", content: `${title}` },
    { name: "og:type", content: contentType },
    { name: "og:url", content: host + path },
    { name: "og:image", content: host + image },
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
const mainUrl = config.rootUrl + config.baseName;

const SEO = (props: any) => (
  <Helmet
    htmlAttributes={{
      lang: "en",
      itemscope: undefined,
      itemtype: `http://schema.org/${props.schema}`,
    }}
    title={props.title}
    link={[
      {
        rel: "canonical",
        href: mainUrl + props.path,
      },
    ]}
    meta={getMetaTags({ ...props })}
  />
);

export default SEO;
