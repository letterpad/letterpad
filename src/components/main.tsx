import ThemeSwitcher from "@/components/theme-switcher";
import { initPageProgress } from "./../shared/utils";
import { useTracking } from "@/hooks/usetracking";
import React, { useEffect } from "react";
import Head from "next/head";
import { basePath } from "@/constants";
import { Page } from "@/page";
import AuthenticatedLayout from "./layouts/Layout";
import AuthenticatedNoLayout from "./layouts/NoLayout";
import StaticLayout from "./layouts/StaticLayout";

interface IProps {
  Component: Page;
  props: any;
}
const Main = ({ Component, props }: IProps) => {
  useTracking();
  const protectedPage = Component.noSession;

  useEffect(() => {
    if (protectedPage) ThemeSwitcher.switch(localStorage.theme);
    initPageProgress();
  }, []);

  let node: JSX.Element;
  if (Component.noSession) {
    node = (
      <StaticLayout>
        <Component {...props} />
      </StaticLayout>
    );
  } else if (Component.noLayout) {
    node = (
      <AuthenticatedNoLayout
        render={({ settings, session }) => {
          return <Component {...props} settings={settings} session={session} />;
        }}
      />
    );
  } else {
    node = (
      <AuthenticatedLayout
        render={({ settings, session }) => {
          return <Component {...props} settings={settings} session={session} />;
        }}
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
