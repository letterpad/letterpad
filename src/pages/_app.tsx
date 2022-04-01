import React from "react";
import { AppProps } from "next/app";
import type { Page } from "../page";
import "lazysizes";
import "../../public/css/globals.css";
import withSessionProvider from "@/hoc/withSessionProvider";
import { ApolloProvider } from "@apollo/client";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import Main from "@/components/main";
import { useSavingIndicator } from "@/hooks/useSavingIndicator";

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  const Indicator = useSavingIndicator();
  return (
    <ApolloProvider client={apolloBrowserClient}>
      {Indicator}
      <Main Component={Component} props={{ ...pageProps }} />
    </ApolloProvider>
  );
}

export default withSessionProvider(MyApp);
