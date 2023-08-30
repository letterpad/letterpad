import classNames from "classnames";
import Link from "next/link";
import { HiPlus } from "react-icons/hi";
import { RiUnsplashFill } from "react-icons/ri";

import { Upload } from "@/components/upload";

import { useUpdatePost } from "../api.client";

export const FeaturedImage = ({ id, cover_image }) => {
  const { updatePost } = useUpdatePost();
  return (
    <div
      className={classNames("relative", {
        "my-10 mb-10": cover_image.src,
      })}
    >
      <Upload
        className="bg-transparent text-slate-300 hover:text-slate-400 dark:bg-transparent dark:hover:text-slate-500"
        url={cover_image.src || ""}
        emptyIcon={
          <div className="flex items-center justify-center gap-2">
            <HiPlus size={18} />
            <span className="mt-0 text-md">Add a cover image</span>
            <RiUnsplashFill size={18} />
          </div>
        }
        onSuccess={([res]) => {
          updatePost({
            id: id,
            cover_image: {
              src: res?.src,
              width: res.size?.width,
              height: res.size?.height,
            },
          });
        }}
      />
    </div>
  );
};
