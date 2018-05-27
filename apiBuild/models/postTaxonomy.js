"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (conn, DataTypes) {
    var PostTaxonomy = conn.define("PostTaxonomy", {
        post_id: {
            type: _sequelize2.default.INTEGER
        },
        taxonomy_id: {
            type: _sequelize2.default.INTEGER
        }
    }, {
        freezeTableName: true
    });
    PostTaxonomy.associate = function (models) {
        PostTaxonomy.belongsTo(models.Post);
    };
    return PostTaxonomy;
};