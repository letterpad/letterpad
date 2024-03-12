import classNames from "classnames";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import React from "react";

import "ui/css/tailwind.css";
import "../../public/css/globals.css";
import "../../public/css/theme-variables.css";
import "ui/css/editor.css";

import { Providers } from "@/components/providers";

import { basePath, gaTrackingId } from "@/constants";

import { CookieBanner } from "../components/cookie-banner";
import { fonts } from "../components/fonts";
import { getRootUrl } from "../shared/getRootUrl";

export const metadata: Metadata = {
  metadataBase: new URL(getRootUrl()),
  title: "Letterpad - A blog publishing platform",
  description:
    "On Letterpad, you can publish your work, engage with readers, connect with other authors, and earn.",
  // viewport: "width=device-width",
  robots: "follow, index",
  openGraph: {
    type: "website",
    url: "https://letterpad.app/",
    title: "Letterpad - A blog publishing platform",
    description:
      "On Letterpad, you can publish your work, engage with readers, connect with other authors, and earn.",
    siteName: "Letterpad - A blog publishing platform",
    images: [
      {
        url: "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad - A blog publishing platform",
      },
    ],
  },
  twitter: {
    site: "@__abhisaha",
    card: "summary_large_image",
    description:
      "On Letterpad, you can publish your work, engage with readers, connect with other authors, and earn.",
    title: "Letterpad - A blog publishing platform",
    images: [
      {
        url: "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad - A blog publishing platform",
      },
    ],
    creator: "Abhishek Saha",
  },
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "logo/favicon-32x32.png",
      url: "logo/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "logo/favicon-16x16.png",
      url: "logo/favicon-16x16.png",
    },
  ],
};

const RootLayout = async ({ children }) => {
  const theme = cookies().get("theme-preference")?.value ?? "light";
  return (
    <html
      lang="en"
      data-color-scheme={theme}
      className={classNames(
        theme,
        fonts.paragraph.variable,
        fonts.code.variable,
        fonts.heading.variable,
        fonts.sans.variable
      )}
    >
      <head>
        <link rel="stylesheet" href={basePath + "/css/theme-variables.css"} />
        <script src={basePath + `/prism/prism.js`} async />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`text-base tracking-tight antialiased dark:bg-gray-900 dark:text-gray-100`}
      >
        {process.env.NODE_ENV === "production" && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
          />
        )}
        <Script id="google-analytics" async={true}>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          
          gtag('config', '${gaTrackingId}');
          `}
        </Script>
        <Providers theme={theme}>{children}</Providers>
        <CookieBanner />
      </body>
    </html>
  );
};

export default RootLayout;
