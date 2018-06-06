var env = require("node-env-file");
env(__dirname + "/../.env");
const config = require("../config");
const express = require("express");
const GraphHTTP = require("express-graphql");
const Schema = require("./schema").default;
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const models = require("./models");
const path = require("path");
const sharp = require("sharp");
// const { seed } = require("./seed/seed");

// require("@google-cloud/profiler").start({
//     serviceContext: {
//         service: "Letterpad Site",
//         version: "1.0.0"
//     }
// });

const app = express();

const SECRET = process.env.SECRET_KEY;

app.use(
    cors({
        exposedHeaders: ["x-refresh-token"]
    })
);
app.options("*", cors());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const addUser = async (req, res) => {
    const token = req.headers["authorization"];
    delete req.user;
    const operationName = req.body.operationName;

    if (operationName === "getOptions") {
        return req.next();
    }

    if (token && token != "null") {
        try {
            const data = await jwt.verify(token, SECRET);
            req.user = { ...data };

            delete data.iat;
            delete data.exp;
            //if (req.params.refresh) {
            const newToken = jwt.sign(data, SECRET, {
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
                SECRET,
                admin: req.headers.admin || false,
                models: models
            }
        };
    })
);

const customStorage = require("./customStorage");

var upload = multer({
    storage: new customStorage({
        destination: function(req, file, cb) {
            let fname = Date.now() + ".jpg";
            cb(null, path.join(__dirname, "../public/uploads/", fname));
        },
        filename: function(req, file, cb) {
            cb(null, Date.now());
        }
    }),
    limits: { fileSize: 5000000 }
});

app.use("/upload", upload.single("file"), (req, res) => {
    let filename = req.file.path.split("/").pop();
    res.json("/uploads/" + filename);
});

// seed the database if settings is empty
// const seedIfEmpty = async () => {
//     const result = await models.Setting.findOne({ where: { id: 1 } });
//     if (!result) {
//         console.log("Seeding");
//         await seed();
//     }
// };
let httpServer = null;

models.conn
    .sync({ force: false })
    .then(async () => {
        // await seedIfEmpty();
        httpServer = app.listen(config.apiPort, function() {
            var host = httpServer.address().address;
            var port = httpServer.address().port;
            console.log("Graphql api listening at http://%s:%s", host, port);
        });
    })
    .catch(e => {
        console.log(e);
    });
export function killServer() {
    httpServer.close();
}
