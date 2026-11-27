import Cloudinary from "cloudinary";
import streamifier from "streamifier";

import { MediaUploadFile, IMediaUploadResult } from "@/graphql/types";

interface IOptions {
  api_key: string;
  api_secret: string;
  cloud_name: string;
}
export async function uploadToCloudinary(
  file: MediaUploadFile,
  options: IOptions
): Promise<IMediaUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = Cloudinary.v2.uploader.upload_stream(
      {
        ...options,
        folder: "blog-images/",
      },
      (error, result) => {
        return result
          ? resolve({
              src: result.url.replace("http://", "https://"),
              error: "",
              name: result.public_id,
              size: {
                width: result.width,
                height: result.height,
                type: result.format,
              },
            })
          : reject(
              new Error(error?.message || "Cloudinary rejected the image.")
            );
      }
    );
    streamifier.createReadStream(file.buffer).on("error", reject).pipe(stream);
  });
}
