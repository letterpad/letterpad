import { AppProps } from "next/app";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useApollo } from "@/graphql/apollo";
import { Provider } from "next-auth/client";
import { useRouter } from "next/router";
import nextConfig from "../../next.config";
import type { Page } from "../page";
import { PropsWithChildren, useEffect, useState } from "react";
import { Setting } from "@/__generated__/queries/queries.graphql";
import ThemeSwitcher from "@/components/layouts/ThemeSwitcher";
import "lazysizes";
import Main from "@/components/main";
import { getSettings, initPageProgress } from "shared/utils";
import dynamic from "next/dynamic";

import "../../styles/globals.css";

type Props = AppProps & {
  Component: Page;
};

function App({ Component, pageProps }: Props) {
  // if (typeof window === "undefined") return null;

  const apolloClientPromise = useApollo(pageProps.initialApolloState);
  const [settings, setSettings] = useState<null | Setting>(null);
  const [apolloClient, setClient] =
    useState<ApolloClient<NormalizedCacheObject>>();
  const router = useRouter();

  const ComponentRequiresAuth = Component.needsAuth;

  if (!ComponentRequiresAuth) {
    return (
      <Provider
        session={pageProps.session}
        options={{ basePath: nextConfig.basePath + "/api/auth" }}
      >
        <Component {...pageProps} />
      </Provider>
    );
  }

  useEffect(() => {
    ThemeSwitcher.switch(localStorage.theme);
    initPageProgress();

    async function init() {
      const client = await apolloClientPromise;
      setClient(client);

      const { data } = await getSettings();
      if (data.settings?.__typename === "Setting") {
        return setSettings(data.settings);
      }
      router.push("/api/auth/signin");
    }
    init();
  }, []);

  const Layout = Component.layout || NoLayout;

  if (!apolloClient || !settings) return null;

  return (
    <Main
      apolloClient={apolloClient}
      Component={Component}
      Layout={Layout}
      props={pageProps}
      settings={settings}
    />
  );
}

function NoLayout({ children }: PropsWithChildren<{ settings: Setting }>) {
  return <>{children}</>;
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
