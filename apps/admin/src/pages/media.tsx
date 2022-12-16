import Head from "next/head";
import { useEffect, useState } from "react";
import { deleteImageAPI, updateImageAPI } from "src/helpers";

import MediaUpdateModal from "@/components/modals/media-update-modal";
import { Buttonv2 } from "@/components_v2/button";
import { Content } from "@/components_v2/content";
import { Message } from "@/components_v2/message";
import { PageHeader } from "@/components_v2/page-header";

import { Media as IMedia, MediaNode } from "@/__generated__/__types__";
import { useMediaQuery } from "@/__generated__/queries/queries.graphql";

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
  }, [loading, data?.media]);
  const deleteImage = async (img: IMedia) => {
    const res = await deleteImageAPI(img);
    if (res.data?.deleteMedia?.__typename === "MediaDeleteResult") {
      const rows = images.rows.filter((item) => item.id !== img.id);
      setImages({ rows, count: images.count - 1 });
    }
  };

  const updateImage = async (img: IMedia) => {
    Message().loading({ content: "Updating, Please wait..." });
    const res = await updateImageAPI(img);
    if (res?.__typename === "MediaUpdateResult") {
      Message().success({ content: "Updated", duration: 3 });
      const updateSrc = images.rows.map((item) =>
        item.id === img.id ? { ...img } : item,
      );
      setImages({ ...images, rows: updateSrc });
    }
    if (res?.__typename === "MediaError") {
      Message().error({ content: res.message, duration: 3 });
    }
    setPreview(undefined);
  };

  return (
    <>
      <Head>
        <title>Media</title>
      </Head>
      <PageHeader className="site-page-header" title="Media">
        <span className="help-text">
          Here you will find the collection of images that you uploaded from
          your computer.
        </span>
      </PageHeader>
      <Content>
        <div className="mx-auto grid grid-cols-3 gap-8 md:grid-cols-4 lg:grid-cols-5 ">
          {images.rows.map((image) => {
            return (
              <div
                className="flex flex-col gap-2 rounded-md bg-slate-200 p-4 align-middle"
                key={image.url}
              >
                <div className="flex  flex-1 items-center justify-center">
                  <img
                    src={image.url}
                    alt="kkkk"
                    loading="lazy"
                    className="max-h-[200px] object-cover"
                    onClick={() => setPreview(image)}
                  />
                </div>
                <Buttonv2
                  size="small"
                  variant="danger"
                  onClick={() => deleteImage(image)}
                >
                  Delete
                </Buttonv2>
              </div>
            );
          })}
        </div>

        {images.rows.length === 0 && <div className="p-4">0 Media found</div>}

        <MediaUpdateModal
          img={preview}
          onChange={setPreview}
          onUpdate={updateImage}
        />
      </Content>
    </>
  );
};

export default Media;
