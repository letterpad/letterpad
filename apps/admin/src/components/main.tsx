import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { TwoColumnLayout } from "ui";

import { useTracking } from "@/hooks/usetracking";

import ThemeSwitcher from "@/components/theme-switcher";

import { RegisterStep } from "@/__generated__/__types__";
import { basePath, registrationPaths } from "@/constants";
import { useHomeQueryQuery } from "@/graphql/queries/queries.graphql";
import { Page } from "@/page";

import { initPageProgress } from "./../shared/utils";
import LoginLayout from "./layouts/LoginLayout";
import MessageLayout from "./layouts/MessageLayout";
import { SiteFooter } from "./layouts/site-footer";
import { LoadingScreen } from "./loading-screen";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar/topBar";

interface IProps {
  Component: Page;
  props: any;
}

const { ProfileInfo, SiteInfo, Registered } = RegisterStep;

const Main = ({ Component, props }: IProps) => {
  const router = useRouter();
  const session = useSession();
  const { data, loading, refetch } = useHomeQueryQuery({
    skip: !session?.data?.user?.id,
  });
  useTracking(session?.data?.user?.id);
  const isPublic =
    Component.isLogin || Component.isPublic || Component.isMessage;
  const { register_step } = session.data?.user || {};

  useEffect(() => {
    if (
      session?.data?.user?.id &&
      isPublic &&
      router.pathname !== "/" &&
      !Component.isPublic
    ) {
      router.push("/posts");
    }
  }, [router, session?.data?.user?.id, isPublic, Component]);
  useEffect(() => {
    if (router.pathname !== "/") {
      ThemeSwitcher.switch(localStorage.theme);
      initPageProgress();
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!isPublic && session.status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (isPublic) return;
    // sometimes homeQuery returns unauthorized user in sqlite db.
    if (data?.me?.__typename !== "Author") {
      refetch();
    }
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
      case Registered:
        if (
          router.pathname === registrationPaths[SiteInfo] ||
          router.pathname === registrationPaths[ProfileInfo]
        ) {
          router.push(registrationPaths[Registered]);
        }
        break;
      default:
        break;
    }
  }, [isPublic, router, register_step, session.status]);

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
      <Component
        {...props}
        settings={data?.settings}
        session={session.data?.user}
        me={data?.me}
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
          <div className="px-4 md:px-6">
            <TopBar />
            <Component {...props} settings={data?.settings} me={data?.me} />
            <SiteFooter />
          </div>
        }
      />
    );
  }

  if (!Component.isPublic && (loading || session.status === "loading")) {
    return <LoadingScreen />;
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
