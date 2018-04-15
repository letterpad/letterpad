"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTaxonomies = undefined;

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (conn, DataTypes) {
    var Taxonomy = conn.define("taxonomies", {
        name: {
            type: _sequelize2.default.STRING
        },
        desc: {
            type: _sequelize2.default.STRING
        },
        slug: {
            type: _sequelize2.default.STRING
        },
        type: {
            type: _sequelize2.default.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    Taxonomy.associate = function (models) {
        Taxonomy.belongsToMany(models.Post, {
            through: "PostTaxonomy"
        });
    };
    return Taxonomy;
};

var getTaxonomies = exports.getTaxonomies = function getTaxonomies(root, args, _ref) {
    var models = _ref.models,
        user = _ref.user;
    var postType = args.postType,
        type = args.type,
        taxId = args.taxId,
        status = args.status;


    var where = {};
    if (!user || !user.id) {
        where.status = "publish";
    }
    if (postType) {
        where.type = postType;
    }

    var query = {
        include: [{
            model: models.Post,
            as: "posts",
            where: where,
            required: true
        }],
        order: [["name", "ASC"]],
        where: { type: type },
        group: ["taxonomy_id", "post_id"]
    };
    if (taxId) {
        query.where.id = taxId;
    }
    if (args.slug) {
        query.where.slug = args.slug;
    }
    return models.Taxonomy.findAll(query);
};