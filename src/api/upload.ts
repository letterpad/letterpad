const path = require("path");
const { resizeImage } = require("./utils/resizeImage");
const uploadDir = path.join(__dirname, "../public/uploads/");
import models = require("./models/index");

import fs from "fs";

export default (req, res) => {
  console.log("reached uploads");
  const uploadedFiles: any = [];
  let files = req.files.file;
  if (!Array.isArray(req.files.file)) {
    files = [files];
  }
  const promises = files.map(file => {
    let filename = file.md5 + ".jpg";
    // resize this image
    const resizedBuffer = resizeImage(req.body.type, file.tempFilePath);
    // save the file
    return (
      resizedBuffer
        // .toFile(uploadDir + filename)
        .then(data => {
          fs.writeFileSync(uploadDir + filename, data);
          uploadedFiles.push({
            src: "/uploads/" + filename,
            errors: null,
          });
          return {
            AuthorId: req.user.id,
            url: "/uploads/" + filename,
          };
        })
        .catch(err => {
          uploadedFiles.push({
            src: "/uploads/" + filename,
            errors: "Error while resizing the image",
          });
          console.log("Error while transforming the imagesize :", err);
        })
    );
  });
  Promise.all(promises).then(filesToSave => {
    // store in database
    //@ts-ignore
    models.default.Media.bulkCreate(filesToSave)
      .then(() => {
        res.json(uploadedFiles);
      })
      .catch(console.log);
  });
};
