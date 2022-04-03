import React from "react";
import { AppProps } from "next/app";
import type { Page } from "../page";
import "lazysizes";
import "../../public/css/globals.css";
import { ApolloProvider } from "@apollo/client";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import Main from "@/components/main";
import { useSavingIndicator } from "@/hooks/useSavingIndicator";
import { SessionProvider } from "next-auth/react";
import { basePath } from "@/constants";

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
