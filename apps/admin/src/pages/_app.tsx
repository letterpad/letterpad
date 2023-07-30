import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import Script from "next/script";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ResponsiveProvider } from "ui";

import "ui/css/tailwind.css";
import "../../public/css/globals.css";
import "ui/css/editor.css";
import "../../public/website/css/style.css";

import { useSavingIndicator } from "@/hooks/useSavingIndicator";

import Main from "@/components/main";

import { basePath, gaTrackingId } from "@/constants";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

import type { Page } from "../page";

type Props = AppProps<{ session: any }> & {
  Component: Page;
};

function LetterpadApp({
  Component,
  pageProps: { session, ...pageProps },
}: Props) {
  const Indicator = useSavingIndicator();
  return (
    <SessionProvider session={session} basePath={basePath + "/api/auth"}>
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
      <ApolloProvider client={apolloBrowserClient}>
        {Indicator}
        <ResponsiveProvider>
          <div id="message" />
          <Main Component={Component} props={{ ...pageProps }} />
          <div id="modal-root" />
        </ResponsiveProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default LetterpadApp;
