import { IMediaUploadResult } from "../types/types";
import { Response } from "express";
import { fetchSettings } from "./fetchSettings";
import logger from "../shared/logger";
import models from "./models";
import path from "path";
import { uploadToCloudinary } from "./providers/cloudinary";
import { uploadToInternal } from "./providers/internal";

const uploadDir = path.join(__dirname, "../public/uploads/");

const upload = async (req, res: Response) => {
  let files = req.files.file;
  if (!req.user || !req.user.id) return res.status(401).send("Unauthorized");
  if (!Array.isArray(files)) {
    files = [files];
  }
  const { id } = req.user;
  const settings = await fetchSettings();
  const { cloudinary_key, cloudinary_name, cloudinary_secret } = settings;
  const cdnEnabled =
    cloudinary_key.value && cloudinary_name.value && cloudinary_secret.value;

  logger.debug(`Received ${files.length} file/s to upload`);

  const output: IMediaUploadResult[] = [];

  for (const file of files) {
    if (file) {
      try {
        let result: IMediaUploadResult;
        if (cdnEnabled) {
          result = await uploadToCloudinary(file, {
            api_key: cloudinary_key.value,
            cloud_name: cloudinary_name.value,
            api_secret: cloudinary_secret.value,
          });
          await upsertMedia(result, id);
          output.push(result);
        } else {
          result = await uploadToInternal(file, uploadDir, id);
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

export default upload;

export async function upsertMedia(
  result: IMediaUploadResult,
  authorId: number,
) {
  const media = await models.Media.findOne({
    raw: true,
    where: {
      url: result.src,
    },
  });
  if (!media) {
    return models.Media.create({
      url: result.src,
      AuthorId: authorId,
      name: result.name,
      description: "",
      height: result.size.height,
      width: result.size.width,
    });
  }
}
