import React from "react";
import app, { AppProps } from "next/app";
import { getSession, useSession } from "next-auth/react";
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

type Props = AppProps & {
  Component: Page;
};

function NoLayout({ children }: PropsWithChildren<{ settings: Setting }>) {
  return <>{children}</>;
}
function MyApp({ Component, pageProps }: Props) {
  const { data, loading: settingsLoading } = useSettingsQuery();
  const { data: sessionData, status: sessionStatus } = useSession();

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
    return <>Loading...</>;
  }

  if (!sessionData || !data || data.settings.__typename !== "Setting") {
    return null;
  }
  return (
    <Main
      Component={Component}
      Layout={Layout}
      props={{ ...pageProps }}
      settings={data.settings}
    />
  );
}

export async function getServerSideProps(ctx) {
  console.log("fetching server props");
  return {
    props: {
      session: await getSession(ctx),
    },
  };
}

MyApp.getInitialProps = async (ctx) => {
  const appProps = await app.getInitialProps(ctx);
  console.log("fetching initial props");
  return {
    props: {
      session: await getSession(ctx),
    },
  };
};

export default withApolloProvider(withSessionProvider(MyApp));
