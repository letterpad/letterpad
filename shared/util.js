const config = require("../config");

const utils = {
    parseErrors: function parseErrors(errObj) {
        const result = [];
        if (errObj && errObj.errors) {
            errObj.errors.map(function(_ref) {
                const message = _ref.message,
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
        const url = config.rootUrl + "/" + parts.join("/");
        return url.replace(/\/\/+/g, "/").replace(":/", "://");
    },

    recurseMenu: function(item, postId, cb) {
        if (item.children && item.children.length > 0) {
            item.children = item.children.map(childItem =>
                utils.recurseMenu(childItem, postId, cb)
            );
        }
        if (item.id == postId) {
            // the slug of this page should change.
            item = cb(item);
        }
        return item;
    },

    getTagsAndCategories: function(taxonomies) {
        let data = { categories: [], tags: [] };
        taxonomies.forEach(taxonomy => {
            if (taxonomy.type === "post_category") {
                data.categories.push(taxonomy);
            } else {
                data.tags.push(taxonomy);
            }
        });
        return data;
    },

    getMetaTags: function(head) {
        let htmlAttrs = "";
        const metaTags = Object.keys(head)
            .map(item => {
                if (item == "htmlAttributes") {
                    htmlAttrs = head[item].toString();
                    return "";
                }
                return head[item].toString();
            })
            .filter(x => x)
            .join("");
        return { htmlAttrs, metaTags };
    },
    createStringFromProps(props) {
        let string = "";
        Object.keys(props).map(key => {
            string += `${key}="${props[key]}" `;
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
    prepareScriptTags: function(data) {
        const defaults = {
            defer: "",
            type: "text/javascript"
        };
        const createScript = params => {
            let props = {};
            if (typeof params === "string") {
                props = { ...defaults, src: utils.makeUrl(params) };
            } else {
                props = {
                    ...defaults,
                    ...params,
                    src: utils.makeUrl(params.src)
                };
            }
            let attrs = utils.createStringFromProps(props);
            return `<script ${attrs}></script>`;
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
    prepareStyleTags: function(data) {
        const defaults = {
            type: "text/css",
            rel: "stylesheet"
        };
        const createScript = params => {
            let props = {};
            if (typeof params === "string") {
                props = { ...defaults, href: utils.makeUrl(params) };
            } else {
                props = {
                    ...defaults,
                    ...params,
                    href: utils.makeUrl(params.href)
                };
            }
            let attrs = utils.createStringFromProps(props);
            return `<link ${attrs}></link>`;
        };

        if (Array.isArray(data)) {
            return data.map(createScript).join("");
        }
        return createScript(data);
    },
    convertQueryToParams: function(query) {
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
    templateEngine: function(template, data) {
        if (typeof data !== "object") return template;

        Object.keys(data).map(name => {
            let regex = new RegExp(`{{${name}}}`, "g");
            template = template.replace(regex, data[name]);
        });
        return template;

        // let start = "{{",
        //     end = "}}",
        //     path = "[a-z0-9_$][\\.a-z0-9_]*", // e.g. config.person.name
        //     pattern = new RegExp(start + "\\s*(" + path + ")\\s*" + end, "gi"),
        //     undef;

        // // Merge data into the template string
        // return template.replace(pattern, function(tag, token) {
        //     let path = token.split("."),
        //         len = path.length,
        //         lookup = data,
        //         i = 0;

        //     for (; i < len; i++) {
        //         lookup = lookup[path[i]];

        //         // Property not found
        //         if (lookup === undef) {
        //             throw `TemplateEngine: ${path[i]} not found in tag`;
        //         }

        //         // Return the required value
        //         if (i === len - 1) {
        //             return lookup;
        //         }
        //     }
        // });
    }
};
module.exports = utils;
