import classNames from "classnames";
import Link from "next/link";
import { FC, useRef, useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { type Crop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

import { CropModal } from "../cropModal";
import { DropZone } from "../../upload";
import { uploadFile } from "../../../shared/utils";
import { EventAction, track } from "../../../track";

interface Props {
  showUnsplash: () => void;
  onInsert: (images: any) => void;
  selectedUrls: any;
  showLocalMedia: () => void;
}
export const UploadZone: FC<Props> = ({
  showUnsplash,
  onInsert,
  selectedUrls,
  showLocalMedia,
}) => {
  const [uploading, setUploading] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempFiles, setTempFiles] = useState<File[] | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const cropImageRef = useRef<HTMLImageElement>(null);
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

  const handleFiles = (files: File[]) => {
    setTempFiles(files);
    setShowCropModal(true);
  };

  const saveCroppedImage = async () => {
    if (!crop) {
      if (tempFiles) return uploadImage([...tempFiles]);
    }
    track({
      eventAction: EventAction.Click,
      eventCategory: "media",
      eventLabel: "crop_image",
    });
    if (crop && cropImageRef.current) {
      setUploading(true);
      const file = getFileFromCrop({
        crop: crop,
        image: cropImageRef.current,
        fileName: tempFiles?.[0].name || "",
      });
      if (file) await uploadImage([file]);
      setUploading(false);
    }
  };

  return (
    <>
      <DropZone
        onDragStateChange={onDragStateChange}
        onFilesDrop={handleFiles}
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
                  <Link
                    href=""
                    onClick={showUnsplash}
                    className="text-blue-500"
                  >
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
                  <AiOutlineCloudUpload size={32} />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
                    e.target.files &&
                      handleFiles(e.target.files as unknown as File[]);
                  }}
                />
              </>
            )}
          </label>
        </div>
      </DropZone>
      <CropModal
        showCropModal={showCropModal}
        crop={crop}
        setCrop={setCrop}
        saveCroppedImage={saveCroppedImage}
        setShowCropModal={setShowCropModal}
        tempFiles={tempFiles}
        uploading={uploading}
        imageRef={cropImageRef}
      />
    </>
  );
};

// helper function to get the cropped image as a file
interface CropProps {
  crop: Crop;
  image: HTMLImageElement;
  fileName: string;
}
function getFileFromCrop({ crop, image, fileName }: CropProps) {
  // create a canvas element to draw the cropped image
  const canvas = document.createElement("canvas");

  // draw the image on the canvas
  if (image) {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    if (ctx) {
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    const base64Image = canvas.toDataURL("image/png"); // can be changed to jpeg/jpg etc

    if (base64Image) {
      // @ts-ignore
      const fileType = base64Image.split(";")[0].split(":")[1];

      const buffer = Buffer.from(
        base64Image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const file = new File([buffer], fileName, { type: fileType });
      return file;
    }
  }
}
