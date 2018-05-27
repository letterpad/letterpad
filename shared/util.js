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
    }
};
module.exports = utils;
