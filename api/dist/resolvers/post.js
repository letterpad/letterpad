"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _post = require("../models/post");

var _taxonomy = require("../models/taxonomy");

var _common = require("../utils/common");

var _permissions = require("../utils/permissions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

function IsJsonString(str) {
    if (!isNaN(str)) return false;
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getConditions(columns, args) {
    var obj = {};
    var conditions = {};
    for (var field in args) {
        if (columns.indexOf(field) >= 0) {
            var validateJSONStr = IsJsonString(args[field]);
            var query = validateJSONStr ? JSON.parse(args[field]) : args[field];
            if (validateJSONStr) {
                obj["$or"] = [{ body: query }, { title: query }, { mdBody: query }];
                // obj["$or"] = [
                //     { body: { ["$like"]: "%" + query + "%" } },
                //     { title: query }
                // ];
            } else {
                obj[field] = query;
            }
        } else {
            conditions[field] = args[field];
        }
    }
    conditions.where = obj;
    return conditions;
}

var _default = {
    Query: {
        posts: _permissions.checkDisplayAccess.createResolver(function (root, args, _ref) {
            var models = _ref.models;

            var newArgs = _extends({}, args);

            if (newArgs.status == "all") {
                newArgs.status = { not: "trash" };
            }

            var columns = Object.keys(models.Post.rawAttributes);
            var conditions = getConditions(columns, newArgs);
            if (newArgs.status) {
                conditions.where.status = newArgs.status;
            }
            return models.Post.count(conditions).then(function (count) {
                if (newArgs.cursor) {
                    conditions.where.id = { gt: newArgs.cursor };
                }
                conditions.order = [["id", "DESC"]];

                return models.Post.findAll(conditions).then(function (res) {
                    return {
                        count: count,
                        rows: res
                    };
                });
            });
        }),
        post: _permissions.checkDisplayAccess.createResolver(function (root, args, _ref2) {
            var models = _ref2.models;

            return models.Post.findOne({ where: args });
        }),
        postsMenu: async function postsMenu(root, args, _ref3) {
            var models = _ref3.models,
                user = _ref3.user;

            var menu = await models.Setting.findOne({
                where: { option: "menu" }
            });
            menu = JSON.parse(menu.dataValues.value);

            var menuItem = null;
            var setItemFromMenu = function setItemFromMenu(arr, slug) {
                var a = arr.some(function (item) {
                    if (item.slug && item.slug == slug) {
                        menuItem = item;
                    }
                    if (item.children && item.children.length > 0) {
                        setItemFromMenu(item.children, slug);
                    }
                });
            };
            setItemFromMenu(menu, args.slug);

            var id = null;

            if (!menuItem) {
                var taxonomy = await models.Taxonomy.findOne({
                    where: { slug: args.slug, type: args.type }
                });
                if (taxonomy) {
                    id = taxonomy.dataValues.id;
                } else {
                    return {
                        count: 0,
                        posts: []
                    };
                }
            } else {
                id = menuItem.id;
            }
            var taxonomies = await (0, _taxonomy.getTaxonomies)(root, {
                type: "post_category",
                taxId: id,
                postType: args.postType,
                status: "publish"
            }, { user: user, models: models });
            if (taxonomies.length === 0) {
                return {
                    count: 0,
                    posts: []
                };
            }
            var conditions = {
                where: { type: args.postType, status: "publish" }
            };

            if ("limit" in args) {
                conditions.limit = args.limit;
            }
            if ("offset" in args) {
                conditions.offset = args.offset;
            }
            conditions.order = [["id", "DESC"]];
            return {
                count: taxonomies[0].dataValues.posts.length,
                posts: await models.Post.findAll(conditions)
            };
        },
        pageMenu: async function pageMenu(root, args, _ref4) {
            var models = _ref4.models;

            var menu = await models.Setting.findOne({
                where: { option: "menu" }
            });
            menu = JSON.parse(menu.dataValues.value);

            var menuItem = null;
            var getItemFromMenu = function getItemFromMenu(arr, slug) {
                return arr.some(function (item) {
                    if (item.slug && item.slug == slug) {
                        menuItem = item;
                    }
                    if (item.children && item.children.length > 0) {
                        getItemFromMenu(item.children, slug);
                    }
                });
            };
            getItemFromMenu(menu, args.slug);
            args.status = "publish";
            var response = {
                ok: true,
                post: null,
                errors: []
            };
            if (!menuItem) {
                var _page = await models.Post.findOne({
                    where: { type: "page", slug: args.slug }
                });
                if (_page) {
                    response.post = _page;
                } else {
                    response.ok = false;
                    response.errors = [{
                        path: "pageMenu",
                        message: "Page not found"
                    }];
                }
                return response;
            }

            var page = await models.Post.findOne({
                where: { id: menuItem.id }
            });
            response.post = page;
            return response;
        },
        adjacentPosts: async function adjacentPosts(root, args, _ref5) {
            var models = _ref5.models;

            var data = {
                previous: {},
                next: {}
            };
            args.status = "publish";
            var postCheck = await models.Post.findOne({ where: args });
            if (postCheck === null) {
                throw new Error("Invalid query");
            }
            var newArgs = _extends({}, args);
            delete newArgs.slug;
            var prevPost = await models.Post.findOne({
                where: _extends({}, newArgs, {
                    id: { $lt: postCheck.dataValues.id }
                }),
                order: [["id", "DESC"]],
                limit: 1
            });
            data.previous = prevPost;
            var nextPost = await models.Post.findOne({
                where: _extends({}, newArgs, {
                    id: {
                        $gt: postCheck.dataValues.id
                    }
                }),
                order: [["id", "ASC"]],
                limit: 1
            });
            data.next = nextPost;
            return data;
        },
        postTaxonomies: _permissions.checkDisplayAccess.createResolver(async function (root, args, context) {
            var taxonomies = await (0, _taxonomy.getTaxonomies)(root, args, context);
            return {
                count: taxonomies[0].dataValues.posts.length,
                posts: taxonomies[0].dataValues.posts
            };
        }),
        postsByTaxSlug: _permissions.checkDisplayAccess.createResolver(async function (root, args, context) {
            var taxonomies = await (0, _taxonomy.getTaxonomies)(root, args, context);
            var conditions = {
                where: { type: args.postType, status: "publish" }
            };

            if (args.limit) {
                conditions.limit = args.limit;
            }
            if (args.offset) {
                conditions.offset = args.offset;
            }
            return {
                count: taxonomies[0].dataValues.posts.length,
                posts: await context.models.Post.findAll(conditions)
            };
        }),
        stats: async function stats(root, args, _ref6) {
            var models = _ref6.models;

            var result = {
                posts: { published: 0, drafts: 0 },
                pages: { published: 0, drafts: 0 },
                tags: 0,
                categories: 0
            };
            result.posts.published = await models.Post.count({
                where: { status: "publish", type: "post" }
            });

            result.posts.drafts = await models.Post.count({
                where: { status: "draft", type: "post" }
            });

            result.pages.published = await models.Post.count({
                where: { status: "publish", type: "page" }
            });

            result.pages.drafts = await models.Post.count({
                where: { status: "draft", type: "page" }
            });

            result.categories = await models.Taxonomy.count({
                where: { type: "post_category" }
            });
            result.tags = await models.Taxonomy.count({
                where: { type: "post_tag" }
            });

            return result;
        }
    },
    Mutation: {
        createPost: _permissions.createPostsPerm.createResolver(function (root, args, _ref7) {
            var models = _ref7.models,
                user = _ref7.user;

            var data = {};
            Object.keys(args).forEach(function (field) {
                data[field] = args[field];
            });
            data.author_id = user.id;
            return (0, _post._createPost)(data, models);
        }),
        updatePost: _permissions.editPostPerm.createResolver(function (root, args, _ref8) {
            var models = _ref8.models;

            var data = {};
            Object.keys(args).forEach(function (field) {
                data[field] = args[field];
            });
            return (0, _post._updatePost)(data, models);
        }),
        uploadFile: _permissions.editPostPerm.createResolver(function (root, args, _ref9) {
            var models = _ref9.models;

            return (0, _post._updatePost)(args, models);
        }),
        deletePosts: _permissions.editPostPerm.createResolver(async function (root, args, _ref10) {
            var models = _ref10.models;

            try {
                var update = await models.Post.update({ status: "trash" }, {
                    where: {
                        id: { in: args.ids.split(",") }
                    }
                });
                if (update) {
                    return {
                        ok: true
                    };
                }
            } catch (e) {
                console.log(e);
            }
        })
    },
    Post: {
        author: function author(post) {
            return post.getAuthor();
        },
        taxonomies: function taxonomies(post) {
            return post.getTaxonomies();
        }
    }
    // PostTaxonomy: {
    //     posts: async (taxonomy, { type, limit, offset }) => {
    //         const conditions = { where: { type, status: "publish" } };
    //         if (limit) {
    //             conditions.limit = limit;
    //         }
    //         if (offset) {
    //             conditions.offset = offset;
    //         }
    //         const result = {};
    //         result.posts = await taxonomy.getPosts(conditions);
    //         result.count = taxonomy.dataValues.posts.length;
    //         return result;
    //     }
    // }
};
exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(IsJsonString, "IsJsonString", "api/resolvers/post.js");
    reactHotLoader.register(getConditions, "getConditions", "api/resolvers/post.js");
    reactHotLoader.register(_default, "default", "api/resolvers/post.js");
    leaveModule(module);
})();

;