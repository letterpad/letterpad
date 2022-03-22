import { GithubOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row } from "antd";
import Layout, { Footer } from "antd/lib/layout/layout";
import { Setting, Stats } from "@/__generated__/__types__";
import {
  StatsQuery,
  StatsQueryVariables,
  StatsDocument,
} from "@/__generated__/queries/queries.graphql";
import { useEffect, useState } from "react";
import Navigation from "./Menu";
import Logo from "../Logo";
import ThemeSwitcher from "./ThemeSwitcher";
import siteConfig from "config/site.config";
import { useSession } from "next-auth/react";
import { useSavingIndicator } from "@/hooks/useSavingIndicator";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";
import ProfileInfo from "./ProfileInfo";
import FeedbackForm from "./FeedbackForm";

interface IProps {
  settings: Setting;
  children: any;
}

const CustomLayout = ({ children, settings }: IProps) => {
  const [stats, setStats] = useState<Stats | {}>({});
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const SavingIndicator = useSavingIndicator();

  const { data: session } = useSession();
  const user = session;

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

  useEffect(() => {
    if (
      user?.user?.email &&
      user?.user?.name &&
      typeof window.rg4js !== "undefined"
    ) {
      window.rg4js("setUser", {
        //@ts-ignore
        identifier: user?.user?.id,
        isAnonymous: false,
        email: user?.user?.email,
        fullName: user?.user?.name,
      });
    }
  }, [user]);

  const handleCollapse = () => {
    setCollapsed(window.innerWidth < 991);
    setMobileMenuVisible(false);
  };

  if (!settings) return null;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Drawer
        mask={false}
        closeIcon={false}
        onClose={() => setMobileMenuVisible(false)}
        drawerStyle={{ background: "rgb(var(--sidebar-bg))" }}
        placement="left"
        bodyStyle={{ background: "rgb(var(--sidebar-bg))" }}
        contentWrapperStyle={{ boxShadow: "none" }}
        headerStyle={{
          padding: "0 24px",
          background: "none",
          borderColor: "#333",
        }}
        width={siteConfig.sidebar_width}
        visible={!collapsed}
        title={
          settings.site_logo?.src ? (
            <Logo src={settings.site_logo.src} padding="16px 0px" />
          ) : (
            <h2>{settings.site_title}</h2>
          )
        }
        footer={
          <ProfileInfo
            name={user?.user?.name}
            avatar={user?.user?.image}
            site_url={settings.site_url}
          />
        }
        footerStyle={{ borderColor: "#333" }}
      >
        <Navigation stats={stats} />
      </Drawer>
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 0 : siteConfig.sidebar_width,
        }}
      >
        <nav className="navbar">
          <Drawer
            onClose={() => setMobileMenuVisible(false)}
            placement="left"
            drawerStyle={{ background: "rgb(var(--sidebar-bg))" }}
            bodyStyle={{ background: "rgb(var(--sidebar-bg))" }}
            contentWrapperStyle={{ boxShadow: "none" }}
            headerStyle={{
              padding: "0 24px",
              background: "none",
              borderColor: "#333",
            }}
            width={siteConfig.sidebar_width}
            visible={mobileMenuVisible}
            title={
              settings.site_logo?.src ? (
                <Logo src={settings.site_logo.src} padding="16px 0px" />
              ) : (
                <h2>{settings.site_title}</h2>
              )
            }
            footer={
              <ProfileInfo
                name={user?.user?.name}
                avatar={user?.user?.image}
                site_url={settings.site_url}
              />
            }
            footerStyle={{ borderColor: "#333" }}
          >
            <Navigation stats={stats} />
          </Drawer>
        </nav>

        <div className="top-bar">
          <div>
            {collapsed && !mobileMenuVisible && (
              <>
                <Button
                  className="menu"
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileMenuVisible(true)}
                />
              </>
            )}
          </div>
          {SavingIndicator}
          <Row>
            <FeedbackForm />
            <ThemeSwitcher />
          </Row>
        </div>
        <div>{children}</div>
        <Footer className="site-footer">
          <Row>
            <Col span={12} offset={0}>
              Letterpad, 2022. An open source project.
            </Col>
            <Col span={12} style={{ textAlign: "center" }}>
              <a href="https://github.com/letterpad/letterpad" target="_blank">
                <GithubOutlined />
              </a>
            </Col>
          </Row>
        </Footer>
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

export default CustomLayout;

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
