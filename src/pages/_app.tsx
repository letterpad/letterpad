import { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from "@apollo/client";
import { initializeApollo, useApollo } from "@/graphql/apollo";
import { Provider } from "next-auth/client";
import Router, { useRouter } from "next/router";
import "antd/dist/antd.dark.css";
import "../../styles/globals.css";
import NProgress from "nprogress";
import nextConfig from "../../next.config";
import type { Page } from "../page";
import { useEffect, useState } from "react";
import {
  Setting,
  SettingsDocument,
  SettingsQuery,
  SettingsQueryVariables,
} from "@/__generated__/queries/queries.graphql";

NProgress.configure({ showSpinner: true });
Router.events.on("routeChangeStart", _url => {
  NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type Props = AppProps & {
  Component: Page;
};

export default function App({ Component, pageProps }: Props) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const [settings, setSettings] = useState<null | Setting>(null);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const router = useRouter();
  useEffect(() => {
    apolloClient.then(client => {
      setClient(client);
    });

    if (!settings) {
      getSettings()
        .then(res => {
          if (res.data.settings?.__typename === "Setting") {
            setSettings(res.data.settings as Setting);
          } else if (res.data.settings?.__typename === "SettingError") {
            router.push("/api/auth/signin");
          }
        })
        .catch(e => {
          router.push("/api/auth/signin");
        });
    }
  }, []);

  if (!client || !settings) return null;

  const Layout =
    Component.layout ||
    (({ children }) => {
      return <>{children}</>;
    });

  return (
    <Provider
      session={pageProps.session}
      options={{ basePath: nextConfig.basePath + "/api/auth" }}
    >
      <ApolloProvider client={client}>
        <Layout settings={settings}>
          <Component {...pageProps} settings={settings} />
        </Layout>
      </ApolloProvider>
    </Provider>
  );
}

async function getSettings() {
  const client = await initializeApollo();
  const settings = await client.query<SettingsQuery, SettingsQueryVariables>({
    query: SettingsDocument,
  });

  return settings;
}
