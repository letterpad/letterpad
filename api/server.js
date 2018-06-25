var env = require("node-env-file");
env(__dirname + "/../.env");
const config = require("../config");
const express = require("express");
const GraphHTTP = require("express-graphql");
const Schema = require("./schema").default;
const upload = require("./upload");
const constants = require("./utils/constants");
const middlewares = require("./middlewares");
const models = require("./models/index");

const app = express();

middlewares(app);

app.use(
    "/graphql",
    GraphHTTP((req, res) => {
        return {
            schema: Schema,
            pretty: true,
            graphiql: true,
            rootValue: {
                request: req
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
                models: models
            }
        };
    })
);

app.use("/upload", upload.any(), (req, res) => {
    const uploadedFiles = [];
    const media = [];
    req.files.forEach(file => {
        let filename = file.path.split("/").pop();
        // colect them to store in database
        media.push({
            author_id: req.user.id,
            url: "/uploads/" + filename
        });
        // store the urls of the uploaded asset to be sent back to the browser
        uploadedFiles.push("/uploads/" + filename);
    });
    // store in database
    models.Media.bulkCreate(media).then(() => {
        res.json(uploadedFiles);
    });
});

let httpServer = app.listen(config.apiPort, function() {
    var host = httpServer.address().address;
    var port = httpServer.address().port;
    console.log("Graphql api listening at http://%s:%s", host, port);
});
module.exports = httpServer;
