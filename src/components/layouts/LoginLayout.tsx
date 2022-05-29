import { Layout } from "antd";
import React from "react";
const { Content, Footer } = Layout;

const LoginLayout = ({ children }) => {
  return (
    <>
      <Layout>
        <Content className="content">{children}</Content>
        <Footer className="footer">
          Letterpad ©2022, An Open Source Project
        </Footer>
      </Layout>
      <style jsx global>{`
        .content {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer {
          text-align: center;
          opacity: 0.7;
          font-size: 0.9em;
          letter-spacing: 1px;
        }
        @media (max-width: 774px) {
          .content {
            margin: 0px;
          }
        }
      `}</style>
    </>
  );
};

export default LoginLayout;
