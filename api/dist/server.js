"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.killServer = killServer;

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _expressGraphql = require("express-graphql");

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _schema = require("./schema");

var _schema2 = _interopRequireDefault(_schema);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var env = require("node-env-file");
env(__dirname + "/../.env");

// import { seed } from "./seed/seed";
console.log(_config2.default);
var app = (0, _express2.default)();

var SECRET = process.env.SECRET_KEY;

app.use((0, _cors2.default)({
    exposedHeaders: ["x-refresh-token"]
}));
app.options("*", (0, _cors2.default)());
app.use(_bodyParser2.default.urlencoded({
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
            var data = await _jsonwebtoken2.default.verify(token, SECRET);
            req.user = _extends({}, data);

            delete data.iat;
            delete data.exp;
            //if (req.params.refresh) {
            var newToken = _jsonwebtoken2.default.sign(data, SECRET, {
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

app.use(_bodyParser2.default.json());
app.use(addUser);
app.use("/graphql", (0, _expressGraphql2.default)(function (req, res) {
    return {
        schema: _schema2.default,
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
            models: _models2.default
        }
    };
}));

var storage = _multer2.default.diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads/"));
    },
    filename: function filename(req, file, cb) {
        var ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

var upload = (0, _multer2.default)({ storage: storage }).single("file");

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

_models2.default.conn.sync({ force: false }).then(async function () {
    // await seedIfEmpty();

    httpServer = app.listen(_config2.default.apiPort, function () {
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
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(app, "app", "api/server.js");
    reactHotLoader.register(SECRET, "SECRET", "api/server.js");
    reactHotLoader.register(addUser, "addUser", "api/server.js");
    reactHotLoader.register(storage, "storage", "api/server.js");
    reactHotLoader.register(upload, "upload", "api/server.js");
    reactHotLoader.register(httpServer, "httpServer", "api/server.js");
    reactHotLoader.register(killServer, "killServer", "api/server.js");
    leaveModule(module);
})();

;