"use strict";

var config = require("../config");

var utils = {
    _extends:
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        },
    parseErrors: function parseErrors(errObj) {
        var result = [];
        if (errObj && errObj.errors) {
            errObj.errors.map(function(_ref) {
                var message = _ref.message,
                    path = _ref.path;

                result.push({ message: message, path: path });
            });
        }
        return result;
    },

    plural: {
        post: "posts",
        page: "pages"
    },

    makeUrl: function makeUrl(parts) {
        if (typeof parts === "string") {
            parts = [parts];
        }
        var url = config.rootUrl + "/" + parts.join("/");
        return url.replace(/\/\/+/g, "/").replace(":/", "://");
    },

    recurseMenu: function recurseMenu(item, postId, cb) {
        if (item.children && item.children.length > 0) {
            item.children = item.children.map(function(childItem) {
                return utils.recurseMenu(childItem, postId, cb);
            });
        }
        if (item.id == postId) {
            // the slug of this page should change.
            item = cb(item);
        }
        return item;
    },

    getTagsAndCategories: function getTagsAndCategories(taxonomies) {
        var data = { categories: [], tags: [] };
        taxonomies.forEach(function(taxonomy) {
            if (taxonomy.type === "post_category") {
                data.categories.push(taxonomy);
            } else {
                data.tags.push(taxonomy);
            }
        });
        return data;
    },

    getMetaTags: function getMetaTags(head) {
        var htmlAttrs = "";
        var metaTags = Object.keys(head)
            .map(function(item) {
                if (item == "htmlAttributes") {
                    htmlAttrs = head[item].toString();
                    return "";
                }
                return head[item].toString();
            })
            .filter(function(x) {
                return x;
            })
            .join("");
        return { htmlAttrs: htmlAttrs, metaTags: metaTags };
    },
    createStringFromProps: function createStringFromProps(props) {
        var string = "";
        Object.keys(props).map(function(key) {
            if (props[key] == "") {
                string += key + " ";
            } else {
                string += key + "=\"" + props[key] + "\" ";
            }
        });
        return string;
    },

    /**
     * data can be an array of objects [{url, defer}, ...]
     * or an array of strings ["url-1","url-2"]
     * or just an object {url}.
     *
     * Prepare this data in a way that it returns
     * <script src="url" {...props}></script>
     */
    prepareScriptTags: function prepareScriptTags(data) {
        var defaults = {
            defer: "",
            type: "text/javascript"
        };
        var createScript = function createScript(params) {
            var props = {};
            if (typeof params === "string") {
                props = utils._extends({}, defaults, {
                    src: utils.makeUrl(params)
                });
            } else {
                props = utils._extends({}, defaults, params, {
                    src: utils.makeUrl(params.src)
                });
            }
            var attrs = utils.createStringFromProps(props);
            return "<script " + attrs + "></script>";
        };

        if (Array.isArray(data)) {
            return data.map(createScript).join("");
        }
        return createScript(data);
    },
    /**
     * data can be an array of objects [{href, defer}, ...]
     * or an array of strings ["url-1","url-2"]
     * or just an object {url}.
     *
     * Prepare this data in a way that it returns
     * <script src="url" {...props}></script>
     */
    prepareStyleTags: function prepareStyleTags(data) {
        var defaults = {
            type: "text/css",
            rel: "stylesheet"
        };
        var createScript = function createScript(params) {
            var props = {};
            if (typeof params === "string") {
                props = utils._extends({}, defaults, {
                    href: utils.makeUrl(params)
                });
            } else {
                props = utils._extends({}, defaults, params, {
                    href: utils.makeUrl(params.href)
                });
            }
            var attrs = utils.createStringFromProps(props);
            return "<link " + attrs + "></link>";
        };

        if (Array.isArray(data)) {
            return data.map(createScript).join("");
        }
        return createScript(data);
    },
    convertQueryToParams: function convertQueryToParams(query) {
        if (!query) {
            return {};
        }

        let hashes = query.slice(query.indexOf("?") + 1).split("&");
        let params = {};
        hashes.map(hash => {
            let [key, val] = hash.split("=");
            params[key] = decodeURIComponent(val);
        });

        return params;
    },
    templateEngine: function templateEngine(template, data) {
        if (typeof data !== "object") return template;

        Object.keys(data).map(function(name) {
            var regex = new RegExp("{{" + name + "}}", "g");
            template = template.replace(regex, data[name]);
        });
        return template;
    }
};
module.exports = utils;
