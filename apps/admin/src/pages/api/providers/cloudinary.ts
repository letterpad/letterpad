import Cloudinary from "cloudinary";
import streamifier from "streamifier";

import { BlobCorrected, IMediaUploadResult } from "@/graphql/types";

interface IOptions {
  api_key: string;
  api_secret: string;
  cloud_name: string;
}
export async function uploadToCloudinary(
  file: BlobCorrected,
  options: IOptions
): Promise<IMediaUploadResult> {
  Cloudinary.v2.config(options);

  return new Promise(async (resolve, reject) => {
    const stream = await Cloudinary.v2.uploader.upload_stream(
      {
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
          : reject({
              src: "",
              error: error?.message,
              name: "",
            });
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
}
