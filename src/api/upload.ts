import Cloudinary from "cloudinary";
import { Response } from "express";
import config from "../config";
import { fetchSettings } from "./fetchSettings";
import { fileUpload } from "express-fileupload";
import fs from "fs";
import logger from "../shared/logger";
import path from "path";
import resizeImage from "./utils/imageHelpers";

const uploadDir = path.join(__dirname, "../public/uploads/");
import models = require("./models/index");

const host = config.ROOT_URL + config.BASE_NAME;

interface IResultItem {
  src: string;
  error: string | null;
  name: string;
  size?: {
    width: number;
    height: number;
    type: string;
  };
}

interface IFile {
  mv: (path: string, callback: () => void) => Promise<IResultItem>;
  md5: string;
  name: string;
  data: Buffer;
}

export default async (req, res: Response) => {
  let files = req.files.file;

  if (!Array.isArray(files)) {
    files = [files];
  }

  const settings = await fetchSettings();
  const { cloudinary_key, cloudinary_name, cloudinary_secret } = settings;
  const cdnEnabled =
    cloudinary_key.value && cloudinary_name.value && cloudinary_secret.value;

  if (cdnEnabled) {
    Cloudinary.v2.config({
      cloud_name: cloudinary_name.value,
      api_key: cloudinary_key.value,
      api_secret: cloudinary_secret.value,
    });
  }
  logger.debug(`Received ${files.length} file/s to upload`);

  const output: IResultItem[] = [];

  for (const file of files) {
    if (file) {
      try {
        if (cdnEnabled) {
          const result = await uploadToCloudinary(file);
          output.push(result);
        } else {
          const result = await resizeAndSave(file, uploadDir, req.user.id);
          output.push(result);
        }
      } catch (e) {
        logger.error(e);
        output.push(e);
      }
    }
  }
  res.json(output);
};

function resizeAndSave(
  file: fileUpload.UploadedFile,
  uploadDir: string,
  id: number,
): Promise<IResultItem> {
  return new Promise((resolve, reject) => {
    // we have received the file through the express-fileupload middleware
    const { md5, name, mv } = file;

    const extension = name.substr(name.lastIndexOf(".") + 1);
    const filename = md5 + "." + extension;
    const uploadPath = uploadDir + filename;
    const tempPath = uploadDir + "temp." + filename;

    const resultItem: IResultItem = { src: "", error: null, name };

    // move the file to a temp path and apply resizer on it
    mv(tempPath, async () => {
      try {
        await resizeImage({
          ext: extension,
          tempPath: tempPath,
          uploadDir: uploadPath,
        });
        // remove the temp file
        fs.unlinkSync(tempPath);
        await models.default.Media.create({
          AuthorId: id,
          url: "/uploads/" + filename,
        });
        resultItem.src = host + "/uploads/" + filename;
        resolve(resultItem);
      } catch (e) {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        logger.error(e, resultItem);
        resultItem.error = e;
        reject(resultItem);
      }
    });
  });
}

async function uploadToCloudinary(
  file: fileUpload.UploadedFile,
): Promise<IResultItem> {
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
