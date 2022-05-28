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
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
      !function(a,b,c,d,e,f,g,h){a.RaygunObject=e,a[e]=a[e]||function(){
      (a[e].o=a[e].o||[]).push(arguments)},f=b.createElement(c),g=b.getElementsByTagName(c)[0],
      f.async=1,f.src=d,g.parentNode.insertBefore(f,g),h=a.onerror,a.onerror=function(b,c,d,f,g){
      h&&h(b,c,d,f,g),g||(g=new Error(b)),a[e].q=a[e].q||[],a[e].q.push({
      e:g})}}(window,document,"script","//cdn.raygun.io/raygun4js/raygun.min.js","rg4js");

      rg4js('apiKey', '${process.env.RAYGUN_API_KEY}');
      rg4js('enableCrashReporting', true);`,
            }}
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
