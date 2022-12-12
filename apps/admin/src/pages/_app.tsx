import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React, { createContext } from "react";
import "lazysizes";

import "../../public/css/globals.css";

import { useSavingIndicator } from "@/hooks/useSavingIndicator";

import Main from "@/components/main";
import {
  Responsive,
  ResponsiveProvider,
} from "@/components_v2/layouts/responsiveProvider";

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
        </ResponsiveProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default LetterpadApp;
