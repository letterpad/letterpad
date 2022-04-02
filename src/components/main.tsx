import ThemeSwitcher from "@/components/theme-switcher";
import { initPageProgress } from "./../shared/utils";
import { useTracking } from "@/hooks/usetracking";
import { useEffect } from "react";
import Head from "next/head";
import { basePath } from "@/constants";
import { Page } from "@/page";
import AuthenticatedLayout from "./layouts/Layout";

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

  return (
    <>
      <Head>
        <link rel="icon" href={basePath + "/uploads/logo.png"} />
      </Head>
      {Component.noSession ? (
        <Component {...props} />
      ) : (
        <AuthenticatedLayout
          render={({ settings, session }) => {
            return (
              <Component {...props} settings={settings} session={session} />
            );
          }}
        />
      )}
    </>
  );
};

export default Main;
