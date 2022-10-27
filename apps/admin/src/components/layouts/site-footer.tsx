import { GithubOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { Footer } from "antd/lib/layout/layout";

export const SiteFooter = () => {
  return (
    <div className="flex flex-row items-center justify-between p-4 text-gray-400 shadow-md">
      <div>Letterpad, 2022. An open source project.</div>
      <div>
        <a
          href="https://github.com/letterpad/letterpad"
          target="_blank"
          rel="noreferrer"
        >
          <GithubOutlined />
        </a>
      </div>
    </div>
  );
  return (
    <Footer className="site-footer">
      <Row>
        <Col span={12} offset={0}>
          Letterpad, 2022. An open source project.
        </Col>
        <Col span={12} style={{ textAlign: "center" }}>
          <a
            href="https://github.com/letterpad/letterpad"
            target="_blank"
            rel="noreferrer"
          >
            <GithubOutlined />
          </a>
        </Col>
      </Row>
    </Footer>
  );
};
