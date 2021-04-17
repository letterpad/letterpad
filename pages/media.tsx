import { Image, Row, Col, Card } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "../layouts/Layout";

const Media = () => {
  return (
    <CustomLayout>
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}
        >
          <Image.PreviewGroup>
            <Row gutter={[16, 16]} justify="start">
              <Col xs={12} sm={6} xl={4}>
                <Card
                  hoverable
                  cover={
                    <Image src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                  }
                >
                  <Card.Meta
                    title="Europe Street beat"
                    description="www.instagram.com"
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} xl={4}>
                <Card
                  hoverable
                  cover={
                    <Image src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                  }
                >
                  <Card.Meta
                    title="Europe Street beat"
                    description="www.instagram.com"
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} xl={4}>
                <Card
                  hoverable
                  cover={
                    <Image src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                  }
                >
                  <Card.Meta
                    title="Europe Street beat"
                    description="www.instagram.com"
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} xl={4}>
                <Card
                  hoverable
                  cover={
                    <Image src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                  }
                >
                  <Card.Meta
                    title="Europe Street beat"
                    description="www.instagram.com"
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6} xl={4}>
                <Card
                  hoverable
                  cover={
                    <Image src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                  }
                >
                  <Card.Meta
                    title="Europe Street beat"
                    description="www.instagram.com"
                  />
                </Card>
              </Col>
            </Row>
          </Image.PreviewGroup>
        </div>
      </Content>
    </CustomLayout>
  );
};

export default Media;
