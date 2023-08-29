"use client";

import { useEffect, useState } from "react";
import { Button, Message } from "ui";
import { useQuery } from "urql";

import MediaUpdateModal from "@/components/modals/media-update-modal";

import { Media as IMedia, MediaNode } from "@/__generated__/__types__";
import {
  MediaDocument,
  MediaQuery,
} from "@/__generated__/src/graphql/queries/queries.graphql";

import { deleteImage, updateImage } from "./api.client";

export const Feature = () => {
  const [{ data }] = useQuery<MediaQuery>({ query: MediaDocument });

  const [preview, setPreview] = useState<IMedia | undefined>();
  const [images, setImages] = useState<MediaNode>({
    count: 0,
    rows: [],
  });

  useEffect(() => {
    if (data?.media.__typename === "MediaNode") {
      setImages(data?.media);
    }
  }, [data?.media]);

  const tryDeleteImage = async (img: IMedia) => {
    const res = await deleteImage(img.id);
    if (res.data?.deleteMedia?.__typename === "MediaDeleteResult") {
      const rows = images.rows.filter((item) => item.id !== img.id);
      setImages({ rows, count: images.count - 1 });
    }
  };

  const tryUpdateImage = async (img: IMedia) => {
    Message().loading({ content: "Updating, Please wait..." });
    const { data } = await updateImage(img);
    if (data?.updateMedia?.__typename === "MediaUpdateResult") {
      Message().success({ content: "Updated", duration: 3 });
      const updateSrc = images.rows.map((item) =>
        item.id === img.id ? { ...img } : item
      );
      setImages({ ...images, rows: updateSrc });
    }
    if (data?.updateMedia?.__typename === "MediaError") {
      Message().error({ content: data?.updateMedia.message, duration: 3 });
    }
    setPreview(undefined);
  };

  return (
    <>
      <div className="mx-auto grid grid-cols-3 gap-8 md:grid-cols-4 lg:grid-cols-5 ">
        {images.rows.map((image) => {
          return (
            <div
              className="flex cursor-pointer flex-col gap-2 rounded-md bg-slate-200 p-4 align-middle dark:bg-slate-800"
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
              <Button
                size="small"
                variant="ghost"
                onClick={() => tryDeleteImage(image)}
              >
                Delete
              </Button>
            </div>
          );
        })}
      </div>

      {images.rows.length === 0 && <div className="p-4">0 Media found</div>}

      <MediaUpdateModal
        img={preview}
        onChange={setPreview}
        onUpdate={tryUpdateImage}
      />
    </>
  );
};
