import { Content } from "antd/lib/layout/layout";

export const Container: React.FC = ({ children }) => {
  return (
    <Content style={{ margin: "24px 16px 0" }}>
      <div
        className="site-layout-background"
        style={{ maxWidth: 760, margin: "auto" }}
      >
        {children}
      </div>
    </Content>
  );
};
