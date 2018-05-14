"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.killServer = killServer;
var env = require("node-env-file");
env(__dirname + "/../.env");
var config = require("../config");
var express = require("express");
var GraphHTTP = require("express-graphql");
var Schema = require("./schema").default;
var bodyParser = require("body-parser");
var cors = require("cors");
var multer = require("multer");
var jwt = require("jsonwebtoken");
var models = require("./models");
var path = require("path");
// const { seed } = require("./seed/seed");

// require("@google-cloud/profiler").start({
//     serviceContext: {
//         service: "Letterpad Site",
//         version: "1.0.0"
//     }
// });

var app = express();

var SECRET = process.env.SECRET_KEY;

app.use(cors({
    exposedHeaders: ["x-refresh-token"]
}));
app.options("*", cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

var addUser = async function addUser(req, res) {
    var token = req.headers["authorization"];
    delete req.user;
    var operationName = req.body.operationName;

    if (operationName === "getOptions") {
        return req.next();
    }

    if (token && token != "null") {
        try {
            var data = await jwt.verify(token, SECRET);
            req.user = _extends({}, data);

            delete data.iat;
            delete data.exp;
            //if (req.params.refresh) {
            var newToken = jwt.sign(data, SECRET, {
                expiresIn: req.user.expiresIn
            });
            res.setHeader("x-refresh-token", newToken);
            // res.send(newToken);
            //}
        } catch (error) {
            console.log("Error in token", error);
            res.status(401);
            res.set("Location", "/admin/login");
        }
    }
    req.next();
};

app.use(bodyParser.json());
app.use(addUser);
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
                    res.set("Location", "/admin/login");
                } else {
                    res.status(500);
                }
            }
            return error;
        },

        context: {
            user: req.user || {},
            error: req.error || null,
            SECRET: SECRET,
            admin: req.headers.admin || false,
            models: models
        }
    };
}));

var storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads/"));
    },
    filename: function filename(req, file, cb) {
        var ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

var upload = multer({ storage: storage }).single("file");

app.post("/upload", function (req, res) {
    upload(req, null, function (err) {
        res.json("/uploads/" + req.file.filename);
    });
});

// seed the database if settings is empty
// const seedIfEmpty = async () => {
//     const result = await models.Setting.findOne({ where: { id: 1 } });
//     if (!result) {
//         console.log("Seeding");
//         await seed();
//     }
// };
var httpServer = null;

models.conn.sync({ force: false }).then(async function () {
    // await seedIfEmpty();
    httpServer = app.listen(config.apiPort, function () {
        var host = httpServer.address().address;
        var port = httpServer.address().port;
        console.log("Graphql api listening at http://%s:%s", host, port);
    });
}).catch(function (e) {
    console.log(e);
});
function killServer() {
    httpServer.close();
}