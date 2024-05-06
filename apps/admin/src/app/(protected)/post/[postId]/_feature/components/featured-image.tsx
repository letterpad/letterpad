import classNames from "classnames";
import { PostWithAuthorAndTagsFragment } from "letterpad-graphql";
import { Controller, useFormContext } from "react-hook-form";
import { HiPlus } from "react-icons/hi";
import { RiUnsplashFill } from "react-icons/ri";

import { Upload } from "@/components/upload";

export const FeaturedImage = () => {
  const { watch, control } = useFormContext<PostWithAuthorAndTagsFragment>();
  return (
    <div
      className={classNames("relative", {
        "my-10 mb-10": watch("cover_image.src"),
      })}
    >
      <Controller
        name="cover_image"
        control={control}
        render={({ field: { onChange } }) => {
          return (
            <Upload
              className="bg-transparent text-slate-300 hover:text-slate-400 dark:bg-transparent dark:hover:text-slate-500"
              url={watch("cover_image.src") ?? ""}
              emptyIcon={
                <div className="flex items-center justify-center gap-2">
                  <HiPlus size={18} />
                  <span className="mt-0 text-md">Add a cover image</span>
                  <RiUnsplashFill size={18} />
                </div>
              }
              onSuccess={([res]) => {
                onChange({
                  src: res?.src,
                  width: res.size?.width,
                  height: res.size?.height,
                });
              }}
            />
          );
        }}
      />
    </div>
  );
};
