import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import Layout, { Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Setting, Stats } from "@/__generated__/type-defs.graphqls";
import {
  StatsQuery,
  StatsQueryVariables,
  StatsDocument,
} from "@/__generated__/queries/queries.graphql";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Navigation from "./Menu";
import Logo from "../Logo";
import { initializeApollo } from "@/graphql/apollo";
import ThemeSwitcher from "./ThemeSwitcher";

interface IProps {
  settings: Setting;
  children: any;
}

const CustomLayout = ({ children, settings }: IProps) => {
  const [stats, setStats] = useState<Stats>({});
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getStats().then(res => {
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
        onBreakpoint={broken => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
          setCollapsed(collapsed);
          if (!collapsed) {
            setVisible(false);
          }
        }}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          zIndex: 9999,
        }}
      >
        <Logo src={settings.site_logo.src} />
        <Navigation stats={stats} />

        <ThemeSwitcher />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <nav className="navbar">
          <StyledDrawer
            placement="left"
            width={200}
            theme="dark"
            onClose={() => setVisible(false)}
            visible={visible}
          >
            <Logo src={settings.site_logo.src} />
            <Navigation stats={stats} />
            <ThemeSwitcher />
          </StyledDrawer>
        </nav>

        <div style={{ minHeight: "72px", padding: 20 }}>
          {collapsed && !visible && (
            <>
              <Button
                className="menu"
                type="ghost"
                icon={<MenuOutlined />}
                onClick={() => setVisible(true)}
                size="middle"
              />
              &nbsp;&nbsp;&nbsp;
              <img src={settings.site_logo.src} height={32} />
            </>
          )}
        </div>
        <div style={{ minHeight: "calc(100vh - 152px)" }}>{children}</div>
        <StyledFooter
          style={{
            textAlign: "center",
            background: "@layout-header-background",
          }}
        >
          Letterpad <br />
          <small>
            {/* Client Token: <strong>{settings.client_token}</strong> */}
          </small>
        </StyledFooter>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;

async function getStats() {
  const client = await initializeApollo();
  const stats = await client.query<StatsQuery, StatsQueryVariables>({
    query: StatsDocument,
    fetchPolicy: "network-only",
  });

  return stats.data.stats;
}

const StyledDrawer = styled(Drawer)`
  .ant-drawer-content {
    background: @layout-sider-background;
  }
  .ant-drawer-body {
    padding: 0px;
  }
`;

const StyledFooter = styled(Footer)`
  background: @layout-sider-background;
`;
