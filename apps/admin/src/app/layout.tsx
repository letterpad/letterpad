// "use client";
import Head from "next/head";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import React from "react";

import "ui/css/tailwind.css";
import "../../public/css/globals.css";
import "../../public/css/theme-variables.css";
import "ui/css/editor.css";
import "../../public/website/css/style.css";

import { Providers } from "../components/providers";
import { basePath, gaTrackingId } from "../constants";
import { getServerSession } from "../middleware";

const RootLayout = async ({ children }) => {
  const theme = cookies().get("theme")?.value ?? "light";
  const session = await getServerSession(headers());

  return (
    <html lang="en" data-color-scheme={theme}>
      <Head>
        <link rel="stylesheet" href={basePath + "/css/theme-variables.css"} />
        <script src={basePath + `/prism/prism.js`} async />
      </Head>
      <body
        className={`font-inter text-base tracking-tight antialiased dark:bg-gray-900 dark:text-gray-100 ${theme}`}
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
        />
        <Script id="google-analytics" async={true}>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${gaTrackingId}');
        `}
        </Script>
        <Providers loggedIn={session?.user?.id}>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
