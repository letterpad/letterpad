import config from "../config";
import fs from "fs";
import logger from "../shared/logger";
import path from "path";
import resizeImage from "./utils/resizeImage";

const uploadDir = path.join(__dirname, "../public/uploads/");
import models = require("./models/index");

const host = config.ROOT_URL + config.BASE_NAME;

interface IResultItem {
  src: string;
  error: string | null;
  name: string;
}

interface IFile {
  mv: (path: string, callback: () => void) => Promise<IResultItem>;
  md5: string;
  name: string;
}

export default async (req, res) => {
  let files = req.files.file;

  if (!Array.isArray(files)) {
    files = [files];
  }

  logger.debug(`Received ${files.length} file/s to upload`);

  const output: IResultItem[] = [];

  for (const file of files) {
    if (file) {
      try {
        const result = await resizeAndSave(file, uploadDir, req.user.id);
        output.push(result);
      } catch (e) {
        logger.error(e);
        output.push(e);
      }
    }
  }
  res.json(output);
};

function resizeAndSave(
  file: IFile,
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
