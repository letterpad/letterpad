import classNames from "classnames";
import Link from "next/link";
import { useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { Button } from "ui";

import { DropZone } from "../../upload";
import { uploadFile } from "../../../shared/utils";

export const UploadZone = ({
  showUnsplash,
  onInsert,
  selectedUrls,
  showLocalMedia,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isDropActive, setIsDropActive] = useState(false);
  const onDragStateChange = (isDragActive) => {
    setIsDropActive(isDragActive);
  };

  const uploadImage = async (files: File[]) => {
    let data = new FormData();
    files.forEach((file) => {
      data.append("file", file);
    });
    const fileSizeIncrease = files.filter((file) => file.size > 10000000);
    if (fileSizeIncrease.length > 0) {
      alert("File size should be less than 10MB");
      return;
    }
    setUploading(true);
    const result = await uploadFile({
      files: files,
      type: "cover_image",
    });
    setUploading(false);
    const urls = { ...selectedUrls };
    result.forEach((r: any) => {
      const {
        src,
        size: { width, height },
      } = r;
      urls[`${src}`] = { src, width, height, caption: "" };
    });
    onInsert(Object.values(urls));
  };
  return (
    <DropZone
      onDragStateChange={onDragStateChange}
      onFilesDrop={uploadImage}
      className={classNames("relative border-2", {
        "rounded-md  border-green-500": isDropActive,
        "border-transparent": !isDropActive,
      })}
    >
      <div className="flex items-center justify-center w-full relative">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800"
        >
          {uploading && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <BiLoaderCircle className="animate-spin" size={24} />
            </div>
          )}

          {!uploading && (
            <>
              <div className="absolute left-1/2 bottom-12 -translate-x-1/2 flex gap-2 text-sm text-opacity-60 justify-center w-full">
                Use
                <Link href="" onClick={showUnsplash} className="text-blue-500">
                  Unsplash
                </Link>
                or browse
                <Link
                  href="#"
                  onClick={showLocalMedia}
                  className="text-blue-500"
                >
                  local media
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 10mb)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={async (e) => {
                  e.target.files && uploadImage(Array.from(e.target.files));
                }}
              />
            </>
          )}
        </label>
      </div>
    </DropZone>
  );
};
