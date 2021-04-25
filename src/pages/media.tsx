import { Image, Row, Col, Card, PageHeader } from "antd";
import { Content } from "antd/lib/layout/layout";
import CustomLayout from "../layouts/Layout";
import { initializeApollo } from "../graphql/apollo";
import {
  MediaDocument,
  MediaQuery,
  MediaQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import { MediaNode, Setting } from "@/__generated__/type-defs.graphqls";
import withAuthCheck from "../hoc/withAuth";

const Media = ({
  data,
  settings,
}: {
  settings: Setting;
  data: { media: MediaNode };
}) => {
  return (
    <CustomLayout settings={settings}>
      <PageHeader
        onBack={() => window.history.back()}
        className="site-page-header"
        title="Media"
        style={{ padding: 10 }}
      ></PageHeader>
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

export default withAuthCheck(Media);

export async function getServerSideProps(context) {
  const apolloClient = initializeApollo({}, context);

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
