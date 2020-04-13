import React, { Props, Component, ReactElement } from "react";

export interface DocumentProps {
  htmlAttrs: Props<any>;
  headTags: (ReactElement | Component)[];
  bodyTags: (ReactElement | Component)[];
  favIcon: string;
  appHtml: string;
  trackingId?: string;
  globals: {
    __APOLLO_STATE__: string;
    __INITIAL_DATA__: string;
    NODE_ENV: string;
    ROOT_URL: string;
    API_URL: string;
    UPLOAD_URL: string;
    APP_PORT: string;
    BASE_NAME: string;
    THEME: string;
  };
}

export default function Document({
  htmlAttrs,
  headTags,
  appHtml,
  globals,
  trackingId,
  bodyTags,
  favIcon,
}: DocumentProps) {
  return (
    <html {...htmlAttrs}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${favIcon}`} />
        <style type="text/css">
          {`
            * {
              margin: 0px;
              padding: 0px;
            }
          `}
        </style>
        {headTags}
      </head>

      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: appHtml }}></div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.__APOLLO_STATE__ = ${globals.__APOLLO_STATE__};
            window.__INITIAL_DATA__ = ${globals.__INITIAL_DATA__};
            window.NODE_ENV = "${globals.NODE_ENV}";
            window.ROOT_URL = "${globals.ROOT_URL}";
            window.API_URL = "${globals.API_URL}";
            window.UPLOAD_URL = "${globals.UPLOAD_URL}";
            window.APP_PORT = ${globals.APP_PORT};
            window.BASE_NAME = "${globals.BASE_NAME}";
            window.THEME = "${globals.THEME}";
          `,
          }}
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${trackingId ? `gtag('config', '${trackingId}');` : ""}
            `,
          }}
        ></script>

        {trackingId ? (
          <script
            src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
          ></script>
        ) : null}

        <script
          async
          src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js"
        ></script>

        {bodyTags}
      </body>
    </html>
  );
}
