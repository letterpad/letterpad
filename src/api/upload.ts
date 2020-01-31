const path = require("path");
const { resizeImage } = require("./utils/resizeImage");
const uploadDir = path.join(__dirname, "../public/uploads/");
import models = require("./models/index");

export default (req, res) => {
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
    return resizedBuffer
      .toFile(uploadDir + filename)
      .catch(err => {
        uploadedFiles.push({
          src: "/uploads/" + filename,
          errors: "Error while resizing the image",
        });
        console.log("Error while transforming the imagesize :", err);
      })
      .then(() => {
        // store the urls of the uploaded asset to be sent back to the browser
        uploadedFiles.push({
          src: "/uploads/" + filename,
          errors: null,
        });
        return {
          authorId: req.user.id,
          url: "/uploads/" + filename,
        };
      });
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
