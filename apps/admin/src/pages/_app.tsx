import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import React from "react";
import "lazysizes";

import "../../public/css/globals.css";

import { useSavingIndicator } from "@/hooks/useSavingIndicator";

import Main from "@/components/main";

import { basePath } from "@/constants";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

import type { Page } from "../page";

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: Props) {
  const Indicator = useSavingIndicator();
  return (
    <SessionProvider session={session} basePath={basePath + "/api/auth"}>
      <ApolloProvider client={apolloBrowserClient}>
        {Indicator}
        <Main Component={Component} props={{ ...pageProps }} />
      </ApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
