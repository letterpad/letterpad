import { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { initializeApollo, useApollo } from "@/graphql/apollo";
import { Provider } from "next-auth/client";
import Router from "next/router";
import "antd/dist/antd.css";
import "../../styles/globals.css";
import NProgress from "nprogress";
import nextConfig from "../../next.config";

import {
  SettingsDocument,
  SettingsQuery,
  SettingsQueryVariables,
} from "@/graphql/queries/queries.graphql";
import { useEffect, useState } from "react";
import { Setting } from "@/__generated__/type-defs.graphqls";
import { LetterpadProvider } from "../context/LetterpadProvider";

NProgress.configure({ showSpinner: true });
Router.events.on("routeChangeStart", _url => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const [settings, setSettings] = useState<null | Setting>(null);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    if (!settings) {
      getSettings().then(res => {
        setSettings(res.data.settings as Setting);
        if (localStorage) {
          localStorage.settings = JSON.stringify(res.data.settings);
        }
      });
    }
    apolloClient.then(client => {
      setClient(client);
    });
  }, []);

  if (!client || !settings) return null;
  return (
    <LetterpadProvider value={settings}>
      <Provider
        session={pageProps.session}
        options={{ basePath: nextConfig.basePath + "/api/auth" }}
      >
        <ApolloProvider client={client}>
          <Component {...pageProps} settings={settings} />
        </ApolloProvider>
      </Provider>
    </LetterpadProvider>
  );
}

async function getSettings() {
  const client = await initializeApollo();
  const settings = await client.query<SettingsQuery, SettingsQueryVariables>({
    query: SettingsDocument,
  });

  return settings;
}
