"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (conn, DataTypes) {
    var Media = conn.define("media", {
        url: {
            type: _sequelize2.default.STRING
        }
    }, {
        freezeTableName: true
    });
    // Media.associate = models => {
    //    // Media.belongsToMany(models.Author);
    // };
    return Media;
};