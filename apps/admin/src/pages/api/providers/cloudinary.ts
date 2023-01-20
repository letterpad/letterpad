import Cloudinary from "cloudinary";
import fs from "fs";

import { BlobCorrected, IMediaUploadResult } from "@/graphql/types";

interface IOptions {
  api_key: string;
  api_secret: string;
  cloud_name: string;
}
export async function uploadToCloudinary(
  file: BlobCorrected,
  uploadPath: string,
  options: IOptions
): Promise<IMediaUploadResult> {
  Cloudinary.v2.config(options);

  return new Promise((resolve, reject) => {
    const fileExistsInternally = fs.existsSync(uploadPath);
    if (!fileExistsInternally) fs.writeFileSync(uploadPath, file.buffer);
    Cloudinary.v2.uploader.upload(
      uploadPath,
      { folder: "blog-images/" },
      (error, result) => {
        if (!fileExistsInternally) {
          fs.unlinkSync(uploadPath);
        }
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
  });
}
