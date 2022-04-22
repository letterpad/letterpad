import React from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
const { Header, Content, Footer } = Layout;

const StaticLayout = ({ children }) => {
  return (
    <>
      <Layout>
        <Header>
          <div className="logo">
            <img src="/admin/uploads/logo.png" height={28} />
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item>
              <Link href="/">Home</Link>
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="content">
          <div className="site-layout-content">{children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Letterpad ©2022, An Open Source Project
        </Footer>
      </Layout>
      <style jsx global>{`
        .content {
          margin: auto;
        }
        .site-page-header {
          border-bottom: 1px solid rgba(var(--color-border), 0.5);
        }
        .site-layout-content {
          min-height: 280px;
          padding: 50px;
        }
        @media (max-width: 774px) {
          .site-layout-content {
            min-height: 280px;
            padding: 16px;
          }
          .ant-layout-header {
            padding: 0 16px;
          }
          .content {
            margin: 0px;
          }
        }
        .logo {
          display: flex;
          align-items: center;
          float: left;
          height: 31px;
          margin: 16px 16px 16px 0;
        }
      `}</style>
    </>
  );
};

export default StaticLayout;
