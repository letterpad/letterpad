"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _db = require("../../config/db.config");

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (conn, DataTypes) {
    var Role = conn.define("roles", {
        name: {
            type: _sequelize2.default.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    Role.associate = function (models) {
        Role.belongsToMany(models.Permission, {
            through: "RolePermission"
        });
        Role.hasMany(models.Author);
    };

    return Role;
};