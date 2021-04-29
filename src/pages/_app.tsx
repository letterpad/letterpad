import { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { useApollo } from "@/graphql/apollo";
import { Provider } from "next-auth/client";
import Router from "next/router";
import "antd/dist/antd.css";
import "../../styles/globals.css";
import NProgress from "nprogress";
import nextConfig from "../../next.config";

import { useEffect, useState } from "react";

NProgress.configure({ showSpinner: true });
Router.events.on("routeChangeStart", _url => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    apolloClient.then(client => {
      setClient(client);
    });
  }, []);

  if (!client) return null;
  return (
    <Provider
      session={pageProps.session}
      options={{ basePath: nextConfig.basePath + "/api/auth" }}
    >
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
}
