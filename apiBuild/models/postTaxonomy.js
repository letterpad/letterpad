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

    return PostTaxonomy;
};

exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(_default, "default", "api/models/postTaxonomy.js");
    leaveModule(module);
})();

;