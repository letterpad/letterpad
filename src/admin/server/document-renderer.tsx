import Document, { DocumentProps } from "../document";
import React, { ReactElement } from "react";

import { Helmet } from "react-helmet";
import ReactDOMServer from "react-dom/server";
import { Setting } from "./../../__generated__/gqlTypes";
import config from "../../config";

export interface DocumentRendererParams {
  settings: Setting;
}

export default function renderDocument({ settings }: DocumentRendererParams) {
  const isDev = process.env.NODE_ENV !== "production";
  const host = config.ROOT_URL + config.BASE_NAME;
  let devBundles = [
    `${host}/static/src/public/js/hot-reload-bundle.js`,
    `${host}/static/src/admin/public/dist/admin-bundle.js`,
  ];
  const prodBundles = [`${host}/admin/dist/admin-bundle.min.js`];
  const bundles = isDev ? devBundles : prodBundles;

  const bodyTags = [...bundles.map(src => <script src={src}></script>)];
  const headTags: JSX.Element[] = [
    <link rel="stylesheet" href={`${host}/admin/css/font-awesome.min.css`} />,
  ];
  if (!isDev) {
    headTags.push(
      <link rel="stylesheet" href={`${host}/admin/css/admin.min.css`} />,
    );
  }

  const props: DocumentProps = {
    headTags,
    bodyTags,
    htmlAttrs: {},
    favIcon: settings.site_favicon.src,
    globals: {
      __APOLLO_STATE__: JSON.stringify({}),
      NODE_ENV: config.NODE_ENV,
      ROOT_URL: config.ROOT_URL,
      API_URL: config.API_URL,
      UPLOAD_URL: config.UPLOAD_URL,
      APP_PORT: config.APP_PORT,
      BASE_NAME: config.BASE_NAME,
      HASH_URL: config.HASH_URL,
    },
  };

  return ReactDOMServer.renderToNodeStream(<Document {...props} />);
}
