"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports._createPost = _createPost;
exports._updatePost = _updatePost;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

var _util = require("../../shared/util");

var _slugify = require("../../shared/slugify");

var _slugify2 = _interopRequireDefault(_slugify);

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (conn, DataTypes) {
    var Post = conn.define("posts", {
        title: {
            type: _sequelize2.default.STRING,
            defaultValue: _config2.default.defaultTitle
        },
        mode: {
            type: _sequelize2.default.STRING,
            defaultValue: "rich-text"
        },
        body: {
            type: _sequelize2.default.TEXT
        },
        mdBody: {
            type: _sequelize2.default.TEXT
        },
        mdPreview: {
            type: _sequelize2.default.TEXT
        },
        excerpt: {
            type: _sequelize2.default.STRING(400),
            defaultValue: ""
        },
        cover_image: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        },
        type: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        },
        status: {
            type: _sequelize2.default.STRING,
            defaultValue: "draft"
        },
        slug: {
            type: _sequelize2.default.STRING,
            defaultValue: ""
        },
        published_at: {
            type: _sequelize2.default.DATE
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    Post.associate = function (models) {
        //  n:m
        Post.belongsToMany(models.Taxonomy, {
            through: "PostTaxonomy",
            as: "taxonomies"
        });
        //  1:m
        Post.belongsTo(models.Author);
    };
    return Post;
};

async function _createPost(data, models) {
    var title = data.title || _config2.default.defaultSlug;
    try {
        //  create the slug
        data.slug = await (0, _slugify2.default)(models.Post, title);

        var newPost = await models.Post.create(data);

        var defaultTaxonomy = await models.Taxonomy.findOne({
            where: { id: 1 }
        });
        await newPost.addTaxonomy(defaultTaxonomy);

        var post = models.Post.findOne({ where: { id: newPost.id } });
        return {
            ok: true,
            post: post,
            errors: []
        };
    } catch (e) {
        var errors = (0, _util.parseErrors)(e);
        return {
            ok: false,
            post: {},
            errors: errors
        };
    }
}

async function _updatePost(post, models) {
    try {
        // first get the post which is being updated
        var oldPost = await models.Post.findOne({
            where: { id: post.id }
        });

        // Create a new slug if the title changes.
        if (post.title !== oldPost.title) {
            //  create the slug
            post.slug = await (0, _slugify2.default)(models.Post, post.title);
        }

        // check the menu. the menu has page items. update the slug of the page menu item if it exist.
        var settings = await models.Setting.findAll();
        var menu = JSON.parse(settings.filter(function (item) {
            return item.option === "menu";
        })[0].value);

        var changeMenuItem = function changeMenuItem(item) {
            if (item.type == "page") {
                item.slug = post.slug;
            }
            return item;
        };
        // loop though the menu and find the item with the current slug and id.
        // if found, update the slug
        var updatedMenu = menu.map(function (item) {
            return (0, _util.recurseMenu)(item, post.id, changeMenuItem);
        });

        try {
            await models.Setting.update({ menu: JSON.stringify(updatedMenu) }, { where: { option: "menu" } });
        } catch (e) {
            console.log(e);
        }

        // If this post is being published for the first time, update the publish date
        if (post.status == "publish" && oldPost.status == "draft") {
            post.published_at = _moment2.default.utc(new Date()).format("YYYY-MM-DD HH:mm:ss");
        }
        await models.Post.update(post, {
            where: { id: post.id }
        });

        // get all values of the updated post
        var newPost = await models.Post.findOne({
            where: { id: post.id }
        });

        // the taxonomies like tags/cathegories might have chqnged or added.
        // sync them
        if (post.taxonomies && post.taxonomies.length > 0) {
            // remove the texonomy relation
            await newPost.setTaxonomies([]);
            await Promise.all(post.taxonomies.map(async function (taxonomy) {
                var taxItem = null;
                // add relation with existing taxonomies
                if (taxonomy.id != 0) {
                    taxItem = await models.Taxonomy.findOne({
                        where: { id: taxonomy.id }
                    });
                    return await newPost.addTaxonomy(taxItem);
                }
                // taxonomies needs to be created
                taxItem = await models.Taxonomy.findOrCreate({
                    where: {
                        name: taxonomy.name,
                        type: taxonomy.type
                    }
                });

                taxItem = await models.Taxonomy.find({
                    where: {
                        name: taxonomy.name,
                        type: taxonomy.type
                    }
                });

                // add relation
                return await newPost.addTaxonomy(taxItem);
            }));
        }

        return {
            ok: true,
            post: newPost,
            errors: []
        };
    } catch (e) {
        return {
            ok: false,
            data: {},
            errors: (0, _util.parseErrors)(e)
        };
    }
}