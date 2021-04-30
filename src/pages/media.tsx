import {
  Image as AntImage,
  Row,
  Col,
  Card,
  PageHeader,
  Space,
  Modal,
  Input,
  Button,
  Popconfirm,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import Image from "next/image";
import CustomLayout from "@/components/layouts/Layout";
import { initializeApollo } from "@/graphql/apollo";
import {
  Media as IMedia,
  MediaDocument,
  MediaQuery,
  MediaQueryVariables,
} from "@/__generated__/queries/queries.graphql";
import { MediaNode, Setting } from "@/__generated__/type-defs.graphqls";
import withAuthCheck from "../hoc/withAuth";
import { useState } from "react";

const Media = ({
  data,
  settings,
}: {
  settings: Setting;
  data: { media: MediaNode };
}) => {
  const [preview, setPreview] = useState<Required<IMedia> | undefined>();

  const deleteImage = img => {
    console.log("img :>> ", img);
  };
  return (
    <CustomLayout settings={settings}>
      <PageHeader
        onBack={() => window.history.back()}
        className="site-page-header"
        title="Media"
        style={{ padding: 10 }}
      ></PageHeader>
      <Content style={{ margin: "16px 0px 0" }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: "72vh" }}
        >
          <Space>
            <Row gutter={[24, 24]} justify="start">
              {data.media.rows.map(image => {
                return (
                  <Col xs={12} sm={6} xl={4} key={image.id}>
                    <Image
                      src={image.url}
                      width={image.width || 100}
                      height={image.height || 200}
                      loading="lazy"
                      layout="intrinsic"
                      onClick={() => setPreview(image)}
                    />
                    <Popconfirm
                      title="Are you sure to delete this image?"
                      onConfirm={e => deleteImage(image)}
                      // onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button size="small" type="link" danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Col>
                );
              })}
            </Row>
          </Space>
        </div>
        <Modal
          title={preview?.name}
          style={{ top: 20 }}
          visible={!!preview?.id}
          // onOk={() => this.setModal1Visible(false)}
          onCancel={() => setPreview(undefined)}
        >
          {preview?.url && (
            <Image
              src={preview.url}
              loading="lazy"
              width={preview.width}
              height={preview.height}
            />
          )}
          <Input
            value={preview?.name}
            onChange={e => {
              if (preview) {
                setPreview({ ...preview, name: e.target.value });
              }
            }}
          />
          <Input.TextArea
            placeholder="Description of this image"
            value={preview?.description}
            onChange={e => {
              if (preview) {
                setPreview({ ...preview, description: e.target.value });
              }
            }}
          />
        </Modal>
      </Content>
    </CustomLayout>
  );
};

export default withAuthCheck(Media);

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
