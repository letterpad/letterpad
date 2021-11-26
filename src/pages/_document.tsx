import React from "react";
import { basePath } from "@/constants";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="stylesheet" href={basePath + "/css/theme-variables.css"} />
          <link
            rel="stylesheet"
            id="theme"
            href={basePath + "/css/antd.variable.css"}
          />
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
