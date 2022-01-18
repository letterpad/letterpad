import React from "react";
import { AppProps } from "next/app";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { Page } from "../page";
import { PropsWithChildren, useEffect } from "react";
import { Setting } from "@/__generated__/__types__";
import ThemeSwitcher from "@/components/layouts/ThemeSwitcher";
import "lazysizes";
import Main from "@/components/main";
import { initPageProgress } from "./../shared/utils";
import "../../styles/globals.css";
import withApolloProvider from "@/hoc/withApolloProvider";
import { useSettingsQuery } from "@/__generated__/queries/queries.graphql";
import withSessionProvider from "@/hoc/withSessionProvider";
import { useTracking } from "@/hooks/usetracking";
import { LetterpadProvider } from "@/context/LetterpadProvider";

type Props = AppProps & {
  Component: Page;
};

function NoLayout({ children }: PropsWithChildren<{ settings: Setting }>) {
  return <>{children}</>;
}
function MyApp({ Component, pageProps }: Props) {
  const { data, loading: settingsLoading } = useSettingsQuery();
  const { data: sessionData, status: sessionStatus } = useSession();
  useTracking();

  const router = useRouter();
  const sessionLoading = sessionStatus === "loading";
  const protectedPage = Component.needsAuth;

  useEffect(() => {
    ThemeSwitcher.switch(localStorage.theme);
    initPageProgress();
  }, []);

  useEffect(() => {
    if (protectedPage && sessionStatus === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [sessionStatus]);

  if (!protectedPage) {
    return <Component {...pageProps} />;
  }

  const Layout = Component.layout || NoLayout;
  if (sessionLoading || settingsLoading) {
    return null;
  }

  if (!sessionData || !data || data.settings.__typename !== "Setting") {
    return null;
  }

  return (
    <LetterpadProvider value={data.settings as Setting}>
      <Main
        Component={Component}
        Layout={Layout}
        props={{ ...pageProps }}
        settings={data.settings as Setting}
      />
    </LetterpadProvider>
  );
}

export default withApolloProvider(withSessionProvider(MyApp));
