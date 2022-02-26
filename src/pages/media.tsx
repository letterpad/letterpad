import { PageHeader, message, Popconfirm, Button } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Empty } from "antd";
import CustomLayout from "@/components/layouts/Layout";
import { useMediaQuery } from "@/__generated__/queries/queries.graphql";
import { MediaNode, Media as IMedia } from "@/__generated__/__types__";
import withAuthCheck from "../hoc/withAuth";
import { deleteImageAPI, updateImageAPI } from "src/helpers";
import { useEffect, useState } from "react";
import MediaUpdateModal from "@/components/modals/media-update-modal";
import Head from "next/head";
import { Grid } from "@/components/grid";

const key = "updatable";

const Media = () => {
  const { loading, data } = useMediaQuery({ variables: { filters: {} } });
  const [preview, setPreview] = useState<IMedia | undefined>();
  const [images, setImages] = useState<MediaNode>({
    count: 0,
    rows: [],
  });

  useEffect(() => {
    if (data?.media.__typename === "MediaNode") {
      setImages(data.media);
    }
  }, [loading]);
  const deleteImage = async (img: IMedia) => {
    const res = await deleteImageAPI(img);
    if (res.data?.deleteMedia?.__typename === "MediaDeleteResult") {
      const rows = images.rows.filter((item) => item.id !== img.id);
      setImages({ rows, count: images.count - 1 });
    }
  };

  const updateImage = async (img: IMedia) => {
    message.loading({ content: "Updating, Please wait...", key });
    const res = await updateImageAPI(img);
    if (res?.__typename === "MediaUpdateResult") {
      message.success({ content: "Updated", key, duration: 3 });
      const updateSrc = images.rows.map((item) =>
        item.id === img.id ? { ...img } : item,
      );
      setImages({ ...images, rows: updateSrc });
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
      <PageHeader className="site-page-header" title="Media">
        Here you will find the collection of images that you uploaded from your
        computer.
      </PageHeader>
      <Content>
        <div className="site-layout-background" style={{ padding: 24 }}>
          <Grid
            images={images.rows}
            onClick={(index) => setPreview(images.rows[index])}
            actions={(index) => {
              return (
                <Popconfirm
                  title="Are you sure to delete this image?"
                  onConfirm={() => deleteImage(images.rows[index])}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button size="small" type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              );
            }}
          />
          {images.rows.length === 0 && (
            <Empty description="No media found" style={{ marginTop: 100 }} />
          )}
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
