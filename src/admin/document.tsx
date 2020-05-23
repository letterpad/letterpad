import React, { Component, Props, ReactElement } from "react";

export interface DocumentProps {
  htmlAttrs: Props<any>;
  headTags: (ReactElement | Component)[];
  bodyTags: (ReactElement | Component)[];
  favIcon: string;
  globals: {
    __APOLLO_STATE__: string;
    NODE_ENV: string;
    ROOT_URL: string;
    API_URL: string;
    UPLOAD_URL: string;
    APP_PORT: string;
    BASE_NAME: string;
    HASH_URL: string;
  };
}

export default function Document({
  htmlAttrs,
  headTags,
  globals,
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
        <div id="app"></div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.__APOLLO_STATE__ = ${globals.__APOLLO_STATE__};
            window.NODE_ENV = "${globals.NODE_ENV}";
            window.ROOT_URL = "${globals.ROOT_URL}";
            window.API_URL = "${globals.API_URL}";
            window.UPLOAD_URL = "${globals.UPLOAD_URL}";
            window.APP_PORT = ${globals.APP_PORT};
            window.BASE_NAME = "${globals.BASE_NAME}";
            window.HASH_URL = "${globals.HASH_URL}";
          `,
          }}
        ></script>

        {bodyTags}
      </body>
    </html>
  );
}
