import { Row, PageHeader, Space, message } from "antd";
import { Content } from "antd/lib/layout/layout";

import CustomLayout from "@/components/layouts/Layout";
import { useMediaQuery } from "@/__generated__/queries/queries.graphql";
import { MediaNode, Media as IMedia } from "@/__generated__/__types__";
import withAuthCheck from "../hoc/withAuth";
import { useState } from "react";
import { deleteImageAPI, updateImageAPI } from "src/helpers";
import MediaUpdateModal from "@/components/modals/media-update-modal";
import Head from "next/head";
import MediaItem from "@/components/MediaItem";

const key = "updatable";

const Media = () => {
  const mediaQ = useMediaQuery({ variables: { filters: {} } });
  const [preview, setPreview] = useState<IMedia | undefined>();
  const [data, setData] = useState<MediaNode>({
    count: mediaQ.data?.media.count || 0,
    rows: mediaQ.data?.media.rows || [],
  });

  const deleteImage = async (img: IMedia) => {
    const res = await deleteImageAPI(img);
    if (res.data?.deleteMedia?.__typename === "MediaDeleteResult") {
      const rows = data.rows.filter((item) => item.id !== img.id);
      setData({ rows, count: data.count - 1 });
    }
  };

  const updateImage = async (img: IMedia) => {
    message.loading({ content: "Updating, Please wait...", key });
    const res = await updateImageAPI(img);
    if (res?.__typename === "MediaUpdateResult") {
      message.success({ content: "Updated", key, duration: 3 });
      const updateSrc = data.rows.map((item) =>
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
              {data.rows.map((image) => (
                <MediaItem
                  image={image}
                  deleteImage={deleteImage}
                  key={image.id}
                  setPreview={setPreview}
                />
              ))}
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
