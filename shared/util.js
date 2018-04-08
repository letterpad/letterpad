"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeUrl = exports.plural = exports.parseErrors = undefined;

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var parseErrors = (exports.parseErrors = function parseErrors(errObj) {
    var result = [];
    if (errObj && errObj.errors) {
        errObj.errors.map(function(_ref) {
            var message = _ref.message,
                path = _ref.path;

            result.push({ message: message, path: path });
        });
    }
    return result;
});

var plural = (exports.plural = {
    post: "posts",
    page: "pages"
});

var makeUrl = (exports.makeUrl = function makeUrl(parts) {
    if (typeof parts === "string") {
        parts = [parts];
    }
    var url = _config2.default.rootUrl + "/" + parts.join("/");
    return url.replace(/\/\/+/g, "/").replace(":/", "://");
});
