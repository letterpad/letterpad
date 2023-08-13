// "use client";
import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Letterpad - A blogging platform",
  description:
    "Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform",
  viewport: "width=device-width",
  robots: "follow, index",
  openGraph: {
    type: "website",
    url: "https://letterpad.app/",
    title: "Letterpad - A free blog publishing platform",
    description:
      "Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform",
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
      "Discover a world of possibilities for your writing and creativity on Letterpad, the premier blogging platform",
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
