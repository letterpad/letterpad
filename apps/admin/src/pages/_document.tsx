import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import React from "react";

import { basePath, gaTrackingId } from "@/constants";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href={basePath + "/css/theme-variables.css"} />
          <script src={basePath + `/prism/prism.js`} async />
        </Head>
        <body className="text-base">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
