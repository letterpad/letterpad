"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = function _default(conn, DataTypes) {
    var Permission = conn.define("permissions", {
        name: {
            type: _sequelize2.default.STRING
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });
    Permission.associate = function (models) {
        Permission.belongsToMany(models.Role, {
            through: "RolePermission"
        });
    };

    return Permission;
};

exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(_default, "default", "api/models/permission.js");
    leaveModule(module);
})();

;