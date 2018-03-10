import express from "express";
import session from "express-session";
import GraphHTTP from "express-graphql";
import Schema from "./schema";
import bodyParser from "body-parser";
import config from "../config/config";
import * as actions from "./actions/index";
import http from "http";
import cors from "cors";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./utils/common";

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
    console.log("........");
    console.log(typeof token, token);
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
                console.log(error);
                if (error.originalError.statusCode == 401) {
                    res.status(error.originalError.statusCode);
                    res.set("Location", "/admin/login");
                } else {
                    res.status(500);
                }
                return error;
            },
            context: {
                user: req.user || {},
                SECRET,
                admin: req.headers.admin || false
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

module.exports = app;
