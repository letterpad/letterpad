var env = require("node-env-file");
env(__dirname + "/../.env");
const config = require("../config");
const express = require("express");
const GraphHTTP = require("express-graphql");
const Schema = require("./schema");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const models = require("./models");
// const { seed } = require("./seed/seed");

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

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../public/uploads/"));
    },
    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

var upload = multer({ storage: storage }).single("file");

app.post("/upload", (req, res) => {
    upload(req, null, function(err) {
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
