import classNames from "classnames";
import Link from "next/link";
import { HiPlus } from "react-icons/hi";
import { RiUnsplashFill } from "react-icons/ri";

import { useUpdatePost } from "@/hooks/useUpdatePost";

import { Upload } from "@/components/upload";

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
          <>
            <HiPlus size={18} />
            <Link href="#aa">Add a cover image</Link>
            <RiUnsplashFill size={18} />
          </>
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
