import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import Layout, { Footer } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import {
  Setting,
  Stats,
} from "../../__generated__/src/graphql/type-defs.graphqls";
import {
  StatsQuery,
  StatsQueryVariables,
  StatsDocument,
} from "../../__generated__/src/graphql/queries/queries.graphql";
import { useEffect, useState } from "react";
import { initializeApollo } from "../graphql/apollo";
import styled from "styled-components";
import Navigation from "./Menu";
import "antd/dist/antd.css";

interface IProps {
  settings: Setting;
  children: any;
}

const CustomLayout = ({ children }: IProps) => {
  const [stats, setStats] = useState<Stats>();
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getStats().then(res => setStats(res));
  }, []);

  return (
    <Layout>
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
        <div className="logo" />
        <Navigation stats={stats} />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? 0 : 200,
        }}
      >
        <nav className="navbar">
          {collapsed && !visible && (
            <Button
              className="menu"
              type="primary"
              icon={<MenuOutlined />}
              onClick={() => setVisible(true)}
            />
          )}
          <StyledDrawer
            placement="left"
            width={200}
            theme="dark"
            onClose={() => setVisible(false)}
            visible={visible}
          >
            <Navigation stats={stats} />
          </StyledDrawer>
        </nav>
        {children}
        <Footer style={{ textAlign: "center" }}>Letterpad</Footer>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;

async function getStats() {
  const client = initializeApollo();
  const stats = await client.query<StatsQuery, StatsQueryVariables>({
    query: StatsDocument,
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
