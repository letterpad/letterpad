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

exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(_default, "default", "api/models/media.js");
    leaveModule(module);
})();

;