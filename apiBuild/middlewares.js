"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var bodyParser = require("body-parser");
var cors = require("cors");
var jwt = require("jsonwebtoken");
var constants = require("./utils/constants");

var corsMiddleWare = cors({
    exposedHeaders: ["x-refresh-token"]
});
var bodyParserMiddleWare = bodyParser.urlencoded({
    extended: true
});

/**
 * For every request from dashboard, we will keep updating the token with the expiry date.
 * This is useful in logging out the user due to inactivity.
 */
var addAdminToken = async function addAdminToken(req, res) {
    var token = req.headers["authorization"];
    delete req.user;
    var operationName = req.body.operationName;

    if (operationName === "getOptions") {
        return req.next();
    }

    if (token && token != "null") {
        try {
            var data = await jwt.verify(token, constants.SECRET);
            req.user = _extends({}, data);

            // while generating the new token we dont need the below data. This gets attached by jwt automatically.
            delete data.iat;
            delete data.exp;

            var newToken = jwt.sign(data, constants.SECRET, {
                expiresIn: req.user.expiresIn
            });
            res.setHeader("x-refresh-token", newToken);
        } catch (error) {
            console.log("Invalid token or token expired");
            res.status(401);
            res.set("Location", constants.LOGIN_URL);
        }
    }
    req.next();
};

module.exports = function (app) {
    app.use(corsMiddleWare);
    app.options("*", cors());
    app.use(bodyParserMiddleWare);
    app.use(bodyParser.json());
    app.use(addAdminToken);
};