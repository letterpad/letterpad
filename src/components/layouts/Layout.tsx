import React from "react";
import Layout from "antd/lib/layout/layout";
import { Stats } from "@/__generated__/__types__";
import {
  StatsQuery,
  StatsQueryVariables,
  StatsDocument,
  SettingsFragmentFragment,
} from "@/__generated__/queries/queries.graphql";
import { useEffect, useState } from "react";
import siteConfig from "config/site.config";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { useErrorReporting } from "@/hooks/useErrorReporting";
import { DesktopMenu } from "./desktop-menu";
import { MobileMenu } from "./mobile-menu";
import { SiteFooter } from "./site-footer";
import { TopBar } from "./top-bar";
import { useLetterpadSession } from "@/hooks/useLetterpadSession";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { SessionData } from "@/graphql/types";

interface IProps {
  render: ({
    settings,
    session,
  }: {
    settings: SettingsFragmentFragment;
    session: SessionData;
  }) => React.ReactChild;
}

const AuthenticatedLayout = ({ render }: IProps) => {
  const { data, loading } = useSettingsQuery();
  const [stats, setStats] = useState<Stats | {}>({});
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const session = useLetterpadSession();

  useErrorReporting(session?.user);

  useEffect(() => {
    getStats().then((res) => {
      if (res?.__typename === "Stats") {
        setStats(res);
      }
    });
    window.addEventListener("resize", handleCollapse);
    handleCollapse();

    return () => {
      window.removeEventListener("resize", handleCollapse);
    };
  }, []);

  const handleCollapse = () => {
    setCollapsed(window.innerWidth < 991);
    setMobileMenuVisible(false);
  };
  if (!session) return null;
  if (loading) return null;
  if (data?.settings.__typename !== "Setting") return null;

  const { settings } = data;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DesktopMenu
        avatar={session.user.avatar}
        name={session.user.name}
        site_logo={settings.site_logo?.src}
        site_title={settings.site_title}
        site_url={settings.site_url}
        isVisible={!collapsed}
        setIsVisible={setMobileMenuVisible}
        stats={stats}
      />
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 0 : siteConfig.sidebar_width,
        }}
      >
        <nav className="navbar">
          <MobileMenu
            avatar={session.user.avatar}
            name={session.user.name}
            site_logo={settings.site_logo?.src}
            site_title={settings.site_title}
            site_url={settings.site_url}
            isVisible={mobileMenuVisible}
            setIsVisible={setMobileMenuVisible}
            stats={stats}
          />
        </nav>

        <div className="top-bar">
          <TopBar
            showNavBtn={collapsed && !mobileMenuVisible}
            onMobileNavBtnClick={setMobileMenuVisible}
          />
        </div>
        <div>{render({ settings, session: session.user })}</div>
        <SiteFooter />
        <style jsx global>{`
          .top-bar {
            padding: 20px;
            padding-top: 10px;
            padding-bottom: 10px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid rgba(var(--color-border), 0.3);
          }
          .ant-drawer-body {
            padding: 0px;
          }
          .site-footer {
            font-size: 11px;
            letter-spacing: 2px;
            color: #666;
            padding: 20px;
          }
          .site-footer a {
            color: #333;
            font-size: 14px;
          }
          .dark .site-footer a {
            color: #fff;
          }
        `}</style>
      </Layout>
    </Layout>
  );
};

export default AuthenticatedLayout;

async function getStats() {
  const stats = await apolloBrowserClient.query<
    StatsQuery,
    StatsQueryVariables
  >({
    query: StatsDocument,
    fetchPolicy: "network-only",
  });

  return stats.data.stats;
}
