import config from "../config";
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

export default async (req, res) => {
  let files = req.files.file;

  if (!Array.isArray(files)) {
    files = [files];
  }

  logger.debug(`Received ${files.length} file/s to upload`);

  const output: IResultItem[] = [];

  for (const file of files) {
    const { md5, name } = file;
    const extension = name.substr(name.lastIndexOf(".") + 1);
    const resultItem: IResultItem = { src: "", error: null, name };
    if (file) {
      let filename = md5 + "." + extension;
      try {
        await resizeImage({
          type: req.body.type,
          ext: extension,
          tempPath: file.tempFilePath,
          uploadDir: uploadDir + filename,
        });
        await models.default.Media.create({
          AuthorId: req.user.id,
          url: "/uploads/" + filename,
        });
        resultItem.src = host + "/uploads/" + filename;
      } catch (e) {
        logger.error(e, resultItem);
        resultItem.src = "";
        resultItem.error = e;
      }
    }
    output.push(resultItem);
  }
  res.json(output);
};
