import Head from "next/head";
import React, { useEffect } from "react";

import { useTracking } from "@/hooks/usetracking";

import ThemeSwitcher from "@/components/theme-switcher";
import { TwoColumnLayout } from "@/components_v2/layouts";

import { basePath } from "@/constants";
import { useHomeQueryQuery } from "@/graphql/queries/queries.graphql";
import { Page } from "@/page";

import { initPageProgress } from "./../shared/utils";
import LoginLayout from "./layouts/LoginLayout";
import AuthenticatedNoLayout from "./layouts/NoLayout";
import StaticLayout from "./layouts/StaticLayout";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar/topBar";

interface IProps {
  Component: Page;
  props: any;
}
const Main = ({ Component, props }: IProps) => {
  useTracking();
  const { data, loading } = useHomeQueryQuery();

  useEffect(() => {
    ThemeSwitcher.switch(localStorage.theme);
    initPageProgress();
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  let node: JSX.Element | null = null;
  if (Component.isPublic) {
    node = <Component {...props} />;
  }

  if (Component.isStatic) {
    node = (
      <StaticLayout>
        <Component {...props} />
      </StaticLayout>
    );
  }

  if (Component.isLogin) {
    node = (
      <LoginLayout>
        <Component {...props} />
      </LoginLayout>
    );
  }

  if (Component.noLayout) {
    node = (
      <AuthenticatedNoLayout
        render={({ settings, session }) => {
          return <Component {...props} settings={settings} session={session} />;
        }}
      />
    );
  }

  if (!node) {
    const settings =
      data?.settings.__typename === "Setting" ? data.settings : null;

    const stats = data?.stats;

    node = (
      <TwoColumnLayout
        left={<Sidebar settings={settings} me={data?.me} stats={data?.stats} />}
        right={
          <>
            <TopBar />
            <Component {...props} settings={data?.settings} me={data?.me} />
          </>
        }
      />
    );
  }
  return (
    <>
      <Head>
        <link rel="icon" href={basePath + "/uploads/logo.png"} />
      </Head>
      {node}
    </>
  );
};

export default Main;
