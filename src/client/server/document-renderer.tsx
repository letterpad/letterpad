import Document, { DocumentProps } from "../document";
import React, { ReactElement } from "react";

import { Helmet } from "react-helmet";
import ReactDOMServer from "react-dom/server";
import { Setting } from "./../../__generated__/gqlTypes";
import config from "../../config";

export interface DocumentRendererParams {
  appHtml: string;
  theme: string;
  apolloState: object;
  initialData: object;
  settings: Setting;
  styleElements: ReactElement[];
}

export default function renderDocument({
  theme,
  appHtml,
  apolloState,
  initialData,
  styleElements,
  settings,
}: DocumentRendererParams) {
  const isDev = process.env.NODE_ENV !== "production";
  const host = config.ROOT_URL + config.BASE_NAME;
  let devBundles = [
    `${host}/static/src/public/js/hot-reload-bundle.js`,
    `${host}/static/src/client/themes/${theme}/public/dist/client-bundle.js`,
  ];
  const prodBundles = [`${host}/${theme}/dist/client-bundle.min.js`];
  const bundles = isDev ? devBundles : prodBundles;

  const helmet = Helmet.renderStatic();

  const bodyTags = [
    ...bundles.map(src => <script src={src}></script>),
    helmet.noscript.toComponent(),
  ];
  const headTags = [
    <link rel="stylesheet" href={`${host}/${theme}/dist/client.min.css`} />,
    helmet.title.toComponent(),
    helmet.meta.toComponent(),
    helmet.style.toComponent(),
    helmet.script.toComponent(),
    helmet.link.toComponent(),
    ...styleElements,
  ];

  const props: DocumentProps = {
    appHtml,
    headTags,
    bodyTags,
    htmlAttrs: {},
    trackingId: settings.google_analytics,
    favIcon: settings.site_favicon.src,
    globals: {
      __APOLLO_STATE__: JSON.stringify(apolloState),
      __INITIAL_DATA__: JSON.stringify(initialData),
      NODE_ENV: config.NODE_ENV,
      ROOT_URL: config.ROOT_URL,
      API_URL: config.API_URL,
      UPLOAD_URL: config.UPLOAD_URL,
      APP_PORT: config.APP_PORT,
      BASE_NAME: config.BASE_NAME,
      THEME: theme,
    },
  };

  return ReactDOMServer.renderToNodeStream(<Document {...props} />);
}
