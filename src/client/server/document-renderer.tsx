import React, { ReactElement } from "react";
import ReactDOMServer from "react-dom/server";
import Document, { DocumentProps } from "../document";
import config from "../../config";
import { Helmet } from "react-helmet";

export interface DocumentRendererParams {
  appHtml: string;
  theme: string;
  apolloState: object;
  initialData: object;
  styleElements: ReactElement[];
}

export default function renderDocument({
  theme,
  appHtml,
  apolloState,
  initialData,
  styleElements,
}: DocumentRendererParams) {
  const isDev = process.env.NODE_ENV !== "production";
  const host = config.ROOT_URL + config.BASE_NAME;
  let devBundles = [
    `${host}/static/src/public/js/hot-reload-bundle.js`,
    `${host}/static/src/public/js/${theme}/vendor-bundle.js`,
    `${host}/static/src/client/themes/${theme}/public/dist/client-bundle.js`,
  ];
  const prodBundles = [
    `${host}/js/${theme}/vendor-bundle.min.js`,
    `${host}/${theme}/dist/client-bundle.min.js`,
  ];
  const bundles = isDev ? devBundles : prodBundles;

  const helmet = Helmet.renderStatic();

  const scriptTags = bundles.map(src => <script src={src}></script>);
  const headTags = [
    <link rel="stylesheet" href={`${host}/${theme}/dist/client.min.css`} />,
    helmet.meta.toComponent(),
    ...styleElements,
  ];

  const props: DocumentProps = {
    appHtml,
    headTags,
    scriptTags,
    htmlAttrs: {},
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

  return ReactDOMServer.renderToString(<Document {...props} />);
}
