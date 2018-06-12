"use strict";

var multer = require("multer");
var path = require("path");
var customStorage = require("./utils/customStorage");

var upload = multer({
    storage: new customStorage({
        destination: function destination(req, file, cb) {
            var fname = Date.now() + ".jpg";
            cb(null, path.join(__dirname, "../public/uploads/", fname));
        },
        filename: function filename(req, file, cb) {
            cb(null, Date.now());
        }
    }),
    limits: { fileSize: 5000000 }
});

module.exports = upload;