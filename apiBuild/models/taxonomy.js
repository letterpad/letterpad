"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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