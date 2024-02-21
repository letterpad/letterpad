import classNames from "classnames";
import { Metadata } from "next";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import Script from "next/script";
import { decode } from "next-auth/jwt";
import React from "react";

import "ui/css/tailwind.css";
import "../../public/css/globals.css";
import "../../public/css/theme-variables.css";
import "ui/css/editor.css";

import { Providers } from "@/components/providers";

import { basePath, gaTrackingId } from "@/constants";

import { fonts } from "../components/fonts";
import { getRootUrl } from "../shared/getRootUrl";
import { getAuthCookieName } from "../utils/authCookie";

export const metadata: Metadata = {
  metadataBase: new URL(getRootUrl()),
  title: "Letterpad - A blogging platform",
  description:
    "Publish stories, build subscribers, follow other publishers and stay connected. Its free.",
  // viewport: "width=device-width",
  robots: "follow, index",
  openGraph: {
    type: "website",
    url: "https://letterpad.app/",
    title: "Letterpad - A free blog publishing platform",
    description:
      "Publish stories, build subscribers, follow other publishers and stay connected. Its free.",
    siteName: "Letterpad - A free blog publishing platform",
    images: [
      {
        url: "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad - A free blog publishing platform",
      },
    ],
  },
  twitter: {
    site: "@__abhisaha",
    card: "summary_large_image",
    description:
      "Publish stories, build subscribers, follow other publishers and stay connected. Its free.",
    title: "Letterpad - A free blog publishing platform",
    images: [
      {
        url: "/website/theme-1.png",
        width: 1200,
        height: 630,
        alt: "Letterpad - A free blog publishing platform",
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
  const theme = cookies().get("theme")?.value ?? "light";
  const userId = await getUserFromCookie(cookies());
  return (
    <html
      lang="en"
      data-color-scheme={theme}
      className={classNames(
        theme + "-theme",
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
        className={`text-base tracking-tight antialiased dark:bg-gray-900 dark:text-gray-100 ${theme}`}
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
          
          gtag('config', '${gaTrackingId}',{'user_id': '${userId}'});
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;

async function getUserFromCookie(cookies: ReadonlyRequestCookies) {
  const sessionCookie = cookies.get(getAuthCookieName());
  if (!sessionCookie) return null;

  try {
    const decoded = await decode({
      token: sessionCookie.value,
      secret: process.env.SECRET_KEY,
    });

    return decoded?.sub;
  } catch (e) {
    return null;
  }
}
