import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";

import { basePath } from "@/constants";

let theme = "antd";
if (typeof localStorage !== "undefined") {
  if (localStorage.theme === "dark") {
    theme = "antd.dark";
  }
}
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* <link rel="stylesheet" href={basePath + "/css/antd.variable.css"} /> */}
          <link rel="stylesheet" href={basePath + "/css/theme-variables.css"} />
          <link
            rel="stylesheet"
            id="theme"
            href={basePath + `/css/${theme}.css`}
          />
          <script src={basePath + `/prism/prism.js`} async />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
