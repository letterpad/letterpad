import { Row, Col, PageHeader, Space, Button, Popconfirm, message } from "antd";
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
import { deleteImageAPI, updateImageAPI } from "src/helpers";
import MediaUpdateModal from "@/components/modals/media-update-modal";
import Head from "next/head";

const key = "updatable";

const Media = ({
  _data,
}: {
  settings: Setting;
  _data: { media: MediaNode };
}) => {
  const [preview, setPreview] = useState<IMedia | undefined>();
  const [data, setData] = useState<MediaNode>({
    count: _data.media.count,
    rows: _data.media.rows,
  });

  const deleteImage = async (img: IMedia) => {
    const res = await deleteImageAPI(img);
    if (res.data?.deleteMedia?.__typename === "MediaDeleteResult") {
      const rows = data.rows.filter(item => item.id !== img.id);
      setData({ rows, count: data.count - 1 });
    }
  };

  const updateImage = async (img: IMedia) => {
    message.loading({ content: "Updating, Please wait...", key });
    const res = await updateImageAPI(img);
    if (res?.__typename === "MediaUpdateResult") {
      message.success({ content: "Updated", key, duration: 3 });
      const updateSrc = data.rows.map(item =>
        item.id === img.id ? { ...img } : item,
      );
      setData({ ...data, rows: updateSrc });
    }
    if (res?.__typename === "MediaError") {
      message.error({ content: res.message, key, duration: 3 });
    }
    setPreview(undefined);
  };

  return (
    <>
      <Head>
        <title>Media</title>
      </Head>
      <PageHeader className="site-page-header" title="Media"></PageHeader>
      <Content>
        <div className="site-layout-background" style={{ padding: 16 }}>
          <Space>
            <Row gutter={[24, 24]} justify="start">
              {data.rows.map(image => {
                return (
                  <Col xs={12} sm={6} xl={4} key={image.id}>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        setPreview(image);
                      }}
                    >
                      <Image
                        src={image.url}
                        width={image.width || 100}
                        height={image.height || 200}
                        loading="lazy"
                        layout="intrinsic"
                      />
                    </a>
                    <Popconfirm
                      title="Are you sure to delete this image?"
                      onConfirm={() => deleteImage(image)}
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
        <MediaUpdateModal
          img={preview}
          onChange={setPreview}
          onUpdate={updateImage}
        />
      </Content>
    </>
  );
};

const MediaWithAuth = withAuthCheck(Media);
MediaWithAuth.layout = CustomLayout;
export default MediaWithAuth;

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
      _data: media.data,
    },
  };
}
