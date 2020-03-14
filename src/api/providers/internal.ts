import { IMediaUploadResult } from "./../../types/types";
import config from "../../config";
import fs from "fs";
import { imageSize } from "image-size";
import logger from "../../shared/logger";
import resizeImage from "../utils/imageHelpers";
import { upsertMedia } from "../upload";

const host = config.ROOT_URL + config.BASE_NAME;

export function uploadToInternal(
  file: any,
  uploadDir: string,
  id: number,
): Promise<IMediaUploadResult> {
  return new Promise((resolve, reject) => {
    // we have received the file through the express-fileupload middleware
    const { md5, name, mv } = file;

    const extension = name.substr(name.lastIndexOf(".") + 1);
    const filename = md5 + "." + extension;
    const uploadPath = uploadDir + filename;
    const tempPath = uploadDir + "temp." + filename;

    const resultItem: IMediaUploadResult = {
      src: "",
      error: null,
      name,
      size: { width: 0, height: 0, type: "" },
    };

    // move the file to a temp path and apply resizer on it
    mv(tempPath, async () => {
      try {
        await resizeImage({
          ext: extension,
          tempPath: tempPath,
          uploadDir: uploadPath,
        });
        const dimensions = await imageSize(tempPath);
        // remove the temp file
        fs.unlinkSync(tempPath);
        resultItem.src = host + "/uploads/" + filename;
        resultItem.size.width = dimensions.width || 0;
        resultItem.size.height = dimensions.height || 0;
        resultItem.size.type = dimensions.type || "";

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
