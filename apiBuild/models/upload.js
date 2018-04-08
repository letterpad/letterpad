"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uploadFile = uploadFile;
exports.uploadCoverImage = uploadCoverImage;
exports.removeFeaturedImage = removeFeaturedImage;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _post = require("./post");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var storage = _multer2.default.diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, _path2.default.join(__dirname, "../../public/uploads/"));
    },
    filename: function filename(req, file, cb) {
        var ext = _path2.default.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext);
    }
});

var upload = (0, _multer2.default)({ storage: storage }).single("file");

function uploadFile(request) {
    return new Promise(function (resolve, reject) {
        upload(request, null, function (err) {
            if (err) {
                return reject(err);
            }

            resolve("/uploads/" + req.file.filename);
        });
    });
}

function uploadCoverImage(request) {
    return new Promise(function (resolve, reject) {
        upload(request, null, function (err) {
            if (err) {
                return reject(err);
            }
            var data = {
                cover_image: "/uploads/" + params.filename,
                id: params.post_id
            };
            (0, _post._updatePost)(data, _models2.default).then(function (result) {
                resolve("/uploads/" + params.filename);
            });
        });
    });
}

function removeFeaturedImage(req, params) {
    return new Promise(function (resolve, reject) {
        var data = {
            cover_image: "",
            id: params.id
        };
        (0, _post._updatePost)(data, _models2.default).then(function (result) {
            resolve("/uploads/" + params.filename);
        });
    });
}
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(storage, "storage", "api/models/upload.js");
    reactHotLoader.register(upload, "upload", "api/models/upload.js");
    reactHotLoader.register(uploadFile, "uploadFile", "api/models/upload.js");
    reactHotLoader.register(uploadCoverImage, "uploadCoverImage", "api/models/upload.js");
    reactHotLoader.register(removeFeaturedImage, "removeFeaturedImage", "api/models/upload.js");
    leaveModule(module);
})();

;