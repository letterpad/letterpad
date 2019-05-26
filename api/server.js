require("@babel/polyfill/noConflict");
var env = require("node-env-file");
env(__dirname + "/../.env");

const Schema = require("./schema").default;
const constants = require("./utils/constants");
const models = require("./models/index");

const GraphHTTP = require("express-graphql");
const upload = require("./upload");
const middlewares = require("./middlewares");

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
        formatError(error) {
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

  app.use("/upload", upload.any(), (req, res) => {
    const uploadedFiles = [];
    const media = [];
    req.files.forEach(file => {
      let filename = file.path.split("/").pop();
      // colect them to store in database
      media.push({
        authorId: req.user.id,
        url: "/uploads/" + filename,
      });
      // store the urls of the uploaded asset to be sent back to the browser
      uploadedFiles.push("/uploads/" + filename);
    });
    // store in database
    models.Media.bulkCreate(media).then(() => {
      res.json(uploadedFiles);
    });
  });
};
