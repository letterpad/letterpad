import React from "react";
import { AppProps } from "next/app";
import type { Page } from "../page";
import "lazysizes";
import "../../styles/globals.css";
import withSessionProvider from "@/hoc/withSessionProvider";
import { ApolloProvider } from "@apollo/client";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

type Props = AppProps & {
  Component: Page;
};

import dynamic from "next/dynamic";
const App = dynamic(() => import("@/components/main"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: Props) {
  return (
    <ApolloProvider client={apolloBrowserClient}>
      <App Component={Component} props={{ ...pageProps }} />
    </ApolloProvider>
  );
}

export default withSessionProvider(MyApp);
