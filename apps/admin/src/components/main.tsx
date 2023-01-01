import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

import { useTracking } from "@/hooks/usetracking";

import ThemeSwitcher from "@/components/theme-switcher";
import { TwoColumnLayout } from "@/components_v2/layouts";

import { RegisterStep } from "@/__generated__/__types__";
import { basePath, registrationPaths } from "@/constants";
import { useHomeQueryQuery } from "@/graphql/queries/queries.graphql";
import { Page } from "@/page";

import { initPageProgress } from "./../shared/utils";
import LoginLayout from "./layouts/LoginLayout";
import MessageLayout from "./layouts/MessageLayout";
import AuthenticatedNoLayout from "./layouts/NoLayout";
import { LoadingScreen } from "./loading-screen";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar/topBar";

interface IProps {
  Component: Page;
  props: any;
}

const { ProfileInfo, SiteInfo } = RegisterStep;

const Main = ({ Component, props }: IProps) => {
  useTracking();
  const router = useRouter();
  const { data, loading } = useHomeQueryQuery();
  const session = useSession();
  const isPublic =
    Component.isLogin || Component.isPublic || Component.isMessage;
  const { register_step } = session.data?.user || {};

  useEffect(() => {
    ThemeSwitcher.switch(localStorage.theme);
    initPageProgress();
  }, []);

  useEffect(() => {
    if (!isPublic && session.status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (isPublic) return;
    switch (register_step) {
      case ProfileInfo:
        if (router.pathname !== registrationPaths[ProfileInfo]) {
          router.push(registrationPaths[ProfileInfo]);
        }
        break;

      case SiteInfo:
        if (router.pathname !== registrationPaths[SiteInfo]) {
          router.push(registrationPaths[SiteInfo]);
        }
        break;
      default:
        break;
    }
  }, [isPublic, router, register_step, session.status]);

  if (loading || session.status === "loading") {
    return <LoadingScreen />;
  }

  let node: JSX.Element | null = null;
  if (Component.isPublic) {
    node = <Component {...props} />;
  }

  if (Component.isMessage) {
    node = (
      <MessageLayout>
        <Component {...props} />
      </MessageLayout>
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

  if (
    !node &&
    session.status === "authenticated" &&
    session.data.user?.register_step === RegisterStep.Registered
  ) {
    node = (
      <TwoColumnLayout
        left={
          <Sidebar
            settings={data?.settings}
            me={data?.me}
            stats={data?.stats}
          />
        }
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
