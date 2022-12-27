import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React from "react";
import "lazysizes";

import "ui/css/tailwind.css";
import "../../public/css/globals.css";
import "ui/css/editor.css";

import { useSavingIndicator } from "@/hooks/useSavingIndicator";

import Main from "@/components/main";
import { ResponsiveProvider } from "@/components_v2/layouts/responsiveProvider";

import { basePath } from "@/constants";
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
