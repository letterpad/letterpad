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
                obj["$or"] = {
                    body: query,
                    title: query,
                    mdBody: query
                };
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

exports.default = {
    Query: {
        /**
         * Query to take care of multiple post in one page.
         * Used for Search and Admin posts and pages list.
         */
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
                conditions.order = [["id", "DESC"]];

                return models.Post.findAll(conditions).then(function (res) {
                    return {
                        count: count,
                        rows: res
                    };
                });
            });
        }),
        /**
         * Query to handle a single post/page.
         */
        post: _permissions.checkDisplayAccess.createResolver(function (root, args, _ref2) {
            var models = _ref2.models;

            return models.Post.findOne({ where: args });
        }),
        /**
         * Query to take care of posts from navigation menu.
         * The navigation menu item will be a category with its own custom slug.
         *
         * First we get the menu object and loop though it to
         * find the item (by matching slug) which was clicked.
         * Note: The menu can have nested children.
         *
         * Now we know the id of the category. Using this id, we will find all the linked posts.
         */
        postsMenu: async function postsMenu(root, args, _ref3) {
            var models = _ref3.models,
                user = _ref3.user;

            var menu = await models.Setting.findOne({
                where: { option: "menu" }
            });

            menu = JSON.parse(menu.dataValues.value);

            var menuItem = null;
            var catId = null;

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

            if (!menuItem) {
                var taxonomy = await models.Taxonomy.findOne({
                    where: { slug: args.slug, type: args.type }
                });
                if (taxonomy) {
                    catId = taxonomy.dataValues.id;
                } else {
                    return {
                        count: 0,
                        posts: []
                    };
                }
            } else {
                catId = menuItem.id;
            }

            var conditions = {
                where: {
                    type: args.postType,
                    status: "publish"
                },
                include: [{
                    model: models.PostTaxonomy,
                    where: { taxonomy_id: catId },
                    require: true
                }],
                order: [["id", "DESC"]]
            };

            if ("limit" in args) {
                conditions.limit = args.limit;
            }
            if ("offset" in args) {
                conditions.offset = args.offset;
            }

            var data = await models.Post.findAndCountAll(conditions);

            return {
                count: data.count,
                posts: data.rows
            };
        },
        /**
         * Query to take care of page clicked from nav menu.
         * As pages cannot have a custom slug, we can directly query the Post table
         * with the given slug.
         *
         */
        pageMenu: async function pageMenu(root, args, _ref4) {
            var models = _ref4.models;

            var response = {
                ok: true,
                post: null,
                errors: []
            };
            var page = await models.Post.findOne({
                where: { type: "page", slug: args.slug, status: "publish" }
            });
            if (page) {
                response.post = page;
            } else {
                response.ok = false;
                response.errors = [{
                    path: "pageMenu",
                    message: "Page not found"
                }];
            }
            return response;
        },
        /**
         * Query to take care of adjacent posts.
         */
        adjacentPosts: async function adjacentPosts(root, args, _ref5) {
            var models = _ref5.models;

            var result = {};
            args.status = "publish";
            // get the current post
            var currentPost = await models.Post.findOne({ where: args });
            if (currentPost === null) {
                throw new Error("Invalid query");
            }

            // we dont need the slug anymore. Clone and remove it.
            var newArgs = _extends({}, args);
            delete newArgs.slug;

            // get the preview item
            result.previous = await models.Post.findOne({
                where: _extends({}, newArgs, {
                    id: { $lt: currentPost.dataValues.id }
                }),
                order: [["id", "DESC"]],
                limit: 1
            });

            // get the next item
            result.next = await models.Post.findOne({
                where: _extends({}, newArgs, {
                    id: {
                        $gt: currentPost.dataValues.id
                    }
                }),
                order: [["id", "ASC"]],
                limit: 1
            });

            return result;
        },
        /**
         * Query to get posts by taxonomy slug and taxonomy type.
         * The type can be post_category or post_tag
         */
        postsByTaxSlug: _permissions.checkDisplayAccess.createResolver(async function (root, args, _ref6) {
            var models = _ref6.models;

            // Get the taxonomy item
            var taxonomy = await models.Taxonomy.findOne({
                where: { slug: args.slug, type: args.type }
            });

            if (taxonomy) {
                var taxId = taxonomy.dataValues.id;
                var conditions = {
                    where: {
                        status: "publish"
                    },
                    include: [{
                        model: models.PostTaxonomy,
                        where: { taxonomy_id: taxId },
                        require: true
                    }],
                    order: [["id", "DESC"]]
                };
                if ("postType" in args) {
                    conditions.where.type = args.postType;
                }
                if ("limit" in args) {
                    conditions.limit = args.limit;
                }
                if ("offset" in args) {
                    conditions.offset = args.offset;
                }

                var data = await models.Post.findAndCountAll(conditions);
                return {
                    count: data.count,
                    posts: data.rows
                };
            } else {
                return {
                    count: 0,
                    posts: []
                };
            }
        }),
        /**
         * Query to get some stats for the admin dashboard
         * TODO: Make one query to process all the data
         */
        stats: async function stats(root, args, _ref7) {
            var models = _ref7.models;

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
        createPost: _permissions.createPostsPerm.createResolver(function (root, args, _ref8) {
            var models = _ref8.models,
                user = _ref8.user;

            var data = {};
            Object.keys(args).forEach(function (field) {
                data[field] = args[field];
            });
            data.author_id = user.id;
            return (0, _post._createPost)(data, models);
        }),
        updatePost: _permissions.editPostPerm.createResolver(function (root, args, _ref9) {
            var models = _ref9.models;

            var data = {};
            Object.keys(args).forEach(function (field) {
                data[field] = args[field];
            });
            return (0, _post._updatePost)(data, models);
        }),
        uploadFile: _permissions.editPostPerm.createResolver(function (root, args, _ref10) {
            var models = _ref10.models;

            return (0, _post._updatePost)(args, models);
        }),
        deletePosts: _permissions.editPostPerm.createResolver(async function (root, args, _ref11) {
            var models = _ref11.models;

            try {
                // check the status of one post. If its already in trash
                // then permanently delete it
                var randomPost = await models.Post.findOne({
                    where: { id: args.ids.split(",")[0] }
                });
                if (randomPost.status == "trash") {
                    await models.Post.destroy({
                        where: { id: { in: args.ids.split(",") } }
                    });
                } else {
                    await models.Post.update({ status: "trash" }, {
                        where: {
                            id: { in: args.ids.split(",") }
                        }
                    });
                }
                return {
                    ok: true
                };
            } catch (e) {
                return {
                    ok: false,
                    errors: [{
                        message: e.message,
                        path: "deleteMessage"
                    }]
                };
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
};