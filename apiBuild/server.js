"use strict";

var env = require("node-env-file");
env(__dirname + "/../.env");
var config = require("../config");
var express = require("express");
var GraphHTTP = require("express-graphql");
var Schema = require("./schema").default;
var models = require("./models");
var upload = require("./upload");
var constants = require("./utils/constants");
var middlewares = require("./middlewares");

var app = express();

middlewares(app);

app.use("/graphql", GraphHTTP(function (req, res) {
    return {
        schema: Schema,
        pretty: true,
        graphiql: true,
        rootValue: {
            request: req
        },
        formatError: function formatError(error) {
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
}));

app.use("/upload", upload.single("file"), function (req, res) {
    var filename = req.file.path.split("/").pop();
    res.json("/uploads/" + filename);
});

var httpServer = app.listen(config.apiPort, function () {
    var host = httpServer.address().address;
    var port = httpServer.address().port;
    console.log("Graphql api listening at http://%s:%s", host, port);
});
module.exports.killServer = function () {
    httpServer.close();
};