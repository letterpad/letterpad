import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ThemeSwitcher from "@/components/layouts/ThemeSwitcher";
import { initPageProgress } from "./../shared/utils";
import { useSettingsQuery } from "@/__generated__/queries/queries.graphql";
import { useTracking } from "@/hooks/usetracking";
import { Setting } from "@/__generated__/__types__";
import { PropsWithChildren, useEffect } from "react";
import Head from "next/head";
import { basePath } from "@/constants";
import { LetterpadProvider } from "@/context/LetterpadProvider";
import { Page } from "@/page";

function NoLayout({ children }: PropsWithChildren<{ settings: Setting }>) {
  return <>{children}</>;
}
interface IProps {
  Component: Page;
  props: any;
}
const Main = ({ Component, props }: IProps) => {
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
    return <Component {...props} />;
  }

  const Layout = Component.layout || NoLayout;
  if (sessionLoading || settingsLoading) {
    return null;
  }

  if (!sessionData || !data || data.settings.__typename !== "Setting") {
    return null;
  }
  return (
    <>
      <LetterpadProvider value={data.settings as Setting}>
        <Head>
          <link rel="icon" href={basePath + "/uploads/logo.png"} />
        </Head>

        <Layout settings={data.settings as Setting}>
          <Component {...props} settings={data.settings} />
        </Layout>
      </LetterpadProvider>
    </>
  );
};

export default Main;
