import Head from "next/head";
import React, { useEffect } from "react";

import { useTracking } from "@/hooks/usetracking";

import ThemeSwitcher from "@/components/theme-switcher";

import { basePath } from "@/constants";
import { Page } from "@/page";

import { initPageProgress } from "./../shared/utils";
import AuthenticatedLayout from "./layouts/Layout";
import LoginLayout from "./layouts/LoginLayout";
import AuthenticatedNoLayout from "./layouts/NoLayout";
import StaticLayout from "./layouts/StaticLayout";

interface IProps {
  Component: Page;
  props: any;
}
const Main = ({ Component, props }: IProps) => {
  useTracking();
  const protectedPage = Component.isStatic;

  useEffect(() => {
    if (protectedPage) ThemeSwitcher.switch(localStorage.theme);
    initPageProgress();
  }, [protectedPage]);

  let node: JSX.Element;
  if (Component.isPublic) {
    node = <Component {...props} />;
  } else if (Component.isStatic) {
    node = (
      <StaticLayout>
        <Component {...props} />
      </StaticLayout>
    );
  } else if (Component.isLogin) {
    node = (
      <LoginLayout>
        <Component {...props} />
      </LoginLayout>
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
