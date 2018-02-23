import express from "express";
import GraphHTTP from "express-graphql";
import Schema from "./schema";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./utils/common";
import models from "./models";
import { seed } from "./seed/seed";

const app = express();
const SECRET = "cdascadsc-cdascadsca";

app.use(cors());
app.options("*", cors());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const addUser = async req => {
    const token = req.headers["authorization"];
    delete req.user;
    if (token) {
        try {
            req.user = await jwt.verify(token, SECRET);
        } catch (error) {
            // we do nothing here. just watch the show
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
                if (error.originalError) {
                    console.log(error);
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
const seedIfEmpty = async () => {
    const result = await models.Setting.findOne({ where: { id: 1 } });
    if (!result) {
        console.log("Seeding");
        await seed();
    }
};
console.log("Initiating Graphql Server");
models.conn.sync({ force: false }).then(async () => {
    await seedIfEmpty();
    const httpServer = app.listen(3030, () => {
        console.log(`App listening on port 3030`);
    });
});
