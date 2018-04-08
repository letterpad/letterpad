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

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = function _default(conn, DataTypes) {
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

exports.default = _default;
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
        if (post.slug && post.slug.indexOf(_config2.default.defaultSlug) === 0 && post.title !== _config2.default.defaulTitle) {
            //  create the slug
            post.slug = await (0, _slugify2.default)(models.Post, post.title);
        }
        if (post.status == "publish") {
            var currentPost = await models.Post.findOne({
                where: { id: post.id }
            });
            if (currentPost.status === "draft") {
                post.published_at = _moment2.default.utc(new Date()).format("YYYY-MM-DD HH:mm:ss");
            }
        }
        await models.Post.update(post, {
            where: { id: post.id }
        });
        var updatedPost = await models.Post.findOne({
            where: { id: post.id }
        });

        if (post.taxonomies && post.taxonomies.length > 0) {
            // remove the texonomy relation
            await updatedPost.setTaxonomies([]);
            await Promise.all(post.taxonomies.map(async function (taxonomy) {
                var taxItem = null;
                // add relation with existing taxonomies
                if (taxonomy.id != 0) {
                    taxItem = await models.Taxonomy.findOne({
                        where: { id: taxonomy.id }
                    });
                    return await updatedPost.addTaxonomy(taxItem);
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
                return await updatedPost.addTaxonomy(taxItem);
            }));
        }

        return {
            ok: true,
            post: updatedPost,
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
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(_createPost, "_createPost", "api/models/post.js");
    reactHotLoader.register(_updatePost, "_updatePost", "api/models/post.js");
    reactHotLoader.register(_default, "default", "api/models/post.js");
    leaveModule(module);
})();

;