import { GithubOutlined, MenuOutlined } from "@ant-design/icons";
import { Button, Col, Drawer, Row } from "antd";
import Layout, { Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Setting, Stats } from "@/__generated__/__types__";
import {
  StatsQuery,
  StatsQueryVariables,
  StatsDocument,
} from "@/__generated__/queries/queries.graphql";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Navigation from "./Menu";
import Logo from "../Logo";
import ThemeSwitcher from "./ThemeSwitcher";
import siteConfig from "config/site.config";
import { useSession } from "next-auth/react";
import { useSavingIndicator } from "@/hooks/useSavingIndicator";
import { apolloBrowserClient } from "@/graphql/apolloBrowserClient";

interface IProps {
  settings: Setting;
  children: any;
}

const CustomLayout = ({ children, settings }: IProps) => {
  // if (typeof window === "undefined") return null;
  const [stats, setStats] = useState<Stats | {}>({});
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const SavingIndicator = useSavingIndicator();

  const { data: session } = useSession();
  const user = session;

  useEffect(() => {
    getStats().then((res) => {
      if (res?.__typename === "Stats") {
        setStats(res);
      }
    });
  }, []);

  if (!settings) return null;
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(isCollapsed) => {
          setCollapsed(isCollapsed);
          if (!isCollapsed) {
            setVisible(false);
          }
        }}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          zIndex: 999,
        }}
        width={siteConfig.sidebar_width}
      >
        {settings.site_logo?.src ? (
          <Row style={{ margin: "auto", marginLeft: 0 }}>
            <Logo src={settings.site_logo.src} />
          </Row>
        ) : (
          <h2>{settings.site_title}</h2>
        )}
        <Navigation stats={stats} />
        <ThemeSwitcher />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 0 : siteConfig.sidebar_width,
        }}
      >
        <nav className="navbar ">
          <StyledDrawer
            placement="left"
            width={200}
            theme="dark"
            onClose={() => setVisible(false)}
            visible={visible}
          >
            <div className="ant-dropdown-menu-dark" style={{ height: "100%" }}>
              <Logo src={settings.site_logo?.src} />
              <Navigation stats={stats} />
              <ThemeSwitcher />
            </div>
          </StyledDrawer>
        </nav>

        <div
          style={{
            padding: 20,
            paddingTop: 10,
            paddingBottom: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            {collapsed && !visible && (
              <>
                <Button
                  className="menu"
                  type="ghost"
                  icon={<MenuOutlined />}
                  onClick={() => setVisible(true)}
                  size="middle"
                />
              </>
            )}
          </div>
          {SavingIndicator}
          <div>
            <a href={settings.site_url} target="_blank">
              View Site
            </a>
            &nbsp;&nbsp; •&nbsp;&nbsp;{user?.user?.name}
          </div>
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
          .site-footer {
            font-size: 11px;
            letter-spacing: 2px;
            color: #666;
            padding: 24px;
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

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0px;
  }
`;
