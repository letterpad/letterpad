const config = require("../config");

module.exports.parseErrors = function parseErrors(errObj) {
    const result = [];
    if (errObj && errObj.errors) {
        errObj.errors.map(function(_ref) {
            const message = _ref.message,
                path = _ref.path;

            result.push({ message: message, path: path });
        });
    }
    return result;
};

module.exports.plural = {
    post: "posts",
    page: "pages"
};

module.exports.makeUrl = function makeUrl(parts) {
    if (typeof parts === "string") {
        parts = [parts];
    }
    const url = config.rootUrl + "/" + parts.join("/");
    return url.replace(/\/\/+/g, "/").replace(":/", "://");
};
