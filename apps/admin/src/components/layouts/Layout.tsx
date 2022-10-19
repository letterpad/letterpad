import Layout from "antd/lib/layout/layout";
import siteConfig from "config/site.config";
import React from "react";
import { useEffect, useState } from "react";

import { useErrorReporting } from "@/hooks/useErrorReporting";
import { useLetterpadSession } from "@/hooks/useLetterpadSession";

import { Stats } from "@/__generated__/__types__";
import {
  SettingsFragmentFragment,
  StatsDocument,
  StatsQuery,
  StatsQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import { useSettingsQuery } from "@/graphql/queries/queries.graphql";
import { SessionData } from "@/graphql/types";

import { DesktopMenu } from "./desktop-menu";
import { MobileMenu } from "./mobile-menu";
import { Sidebar } from "./sidebar";
import { SiteFooter } from "./site-footer";
import { TopBar } from "./top-bar";

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
  const [stats, setStats] = useState<Stats | Record<string, unknown>>({});
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

  const sidebar = (
    <Sidebar
      avatar={session.user.avatar}
      name={session.user.name}
      site_url={settings.site_url}
      stats={stats}
    />
  );
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <DesktopMenu isVisible={!collapsed} setIsVisible={setMobileMenuVisible}>
        {sidebar}
      </DesktopMenu>
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 0 : siteConfig.sidebar_width,
        }}
      >
        <nav className="navbar">
          <MobileMenu
            isVisible={mobileMenuVisible}
            setIsVisible={setMobileMenuVisible}
          >
            {sidebar}
          </MobileMenu>
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