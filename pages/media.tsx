import { Image, Row, Col, Card } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "../layouts/Layout";
import { initializeApollo } from "../lib/apollo";
import {
  MediaDocument,
  MediaQuery,
  MediaQueryVariables,
} from "../__generated__/lib/queries/queries.graphql";
import { MediaNode } from "../__generated__/lib/type-defs.graphqls";

const Media = ({ data }: { data: { media: MediaNode } }) => {
  return (
    <CustomLayout>
      <Content style={{ margin: "24px 16px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}
        >
          <Image.PreviewGroup>
            <Row gutter={[24, 24]} justify="start">
              {data.media.rows.map(image => {
                return (
                  <Col xs={12} sm={6} xl={4}>
                    <Card hoverable cover={<Image src={image.url} />}>
                      <Card.Meta
                        title={image.name}
                        description={image.createdAt}
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Image.PreviewGroup>
        </div>
      </Content>
    </CustomLayout>
  );
};

export default Media;

export async function getServerSideProps(context) {
  const apolloClient = await initializeApollo({}, context);

  const media = await apolloClient.query<MediaQuery, MediaQueryVariables>({
    query: MediaDocument,
    variables: {
      filters: {},
    },
  });
  return {
    props: {
      data: media.data,
    },
  };
}
