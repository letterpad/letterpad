require("@babel/polyfill/noConflict");
// const env = require("node-env-file");
// env(__dirname + "/../../.env");

const path = require("path");
const GraphHTTP = require("express-graphql");

const Schema = require("./schema").default;
const constants = require("./utils/constants");
const models = require("./models/index");
const { resizeImage } = require("./utils/resizeImage");
const middlewares = require("./middlewares");
const uploadDir = path.join(__dirname, "../public/uploads/");

module.exports = app => {
  middlewares(app);

  app.use(
    `${process.env.baseName}/graphql`,
    GraphHTTP((req, res) => {
      return {
        schema: Schema,
        pretty: true,
        graphiql: true,
        rootValue: {
          request: req,
        },
        customFormatErrorFn(error) {
          console.log(error);
          if (error.originalError) {
            if (error.originalError.statusCode == 401) {
              res.status(error.originalError.statusCode);
              res.set("Location", constants.LOGIN_URL);
            } else {
              res.status(500);
            }
          }
          return error;
        },
        context: {
          user: req.user || {},
          error: req.error || null,
          SECRET: constants.SECRET,
          admin: req.headers.admin || false,
          models: models,
        },
      };
    }),
  );

  app.use("/upload", (req, res) => {
    const uploadedFiles = [];
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
      models.Media.bulkCreate(filesToSave).then(() => {
        res.json(uploadedFiles);
      });
    });
  });
};
