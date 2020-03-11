import Cloudinary from "cloudinary";
import { IMediaUploadResult } from "./../../types/types";
import fileUpload from "express-fileupload";
import fs from "fs";

interface IOptions {
  api_key: string;
  api_secret: string;
  cloud_name: string;
}
export async function uploadToCloudinary(
  file: fileUpload.UploadedFile,
  options: IOptions,
): Promise<IMediaUploadResult> {
  Cloudinary.v2.config(options);

  return await new Promise((resolve, reject) => {
    const tempFile = "/tmp/" + file.md5;
    fs.writeFileSync(tempFile, file.data);
    Cloudinary.v2.uploader.upload(
      tempFile,
      { folder: "blog-images/" },
      (error, result) => {
        fs.unlinkSync(tempFile);
        return result
          ? resolve({
              src: result.url,
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
              error: error.message,
              name: "",
            });
      },
    );
  });
}
