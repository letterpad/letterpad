"use strict";

var _db = require("../config/db.config");

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var models = {
    Author: _db.conn.import("./models/author"),
    Post: _db.conn.import("./models/post"),
    Taxonomy: _db.conn.import("./models/taxonomy"),
    Role: _db.conn.import("./models/role"),
    Permission: _db.conn.import("./models/permission"),
    Setting: _db.conn.import("./models/settings"),
    Media: _db.conn.import("./models/media"),
    PostTaxonomy: _db.conn.import("./models/postTaxonomy")
};
Object.keys(models).forEach(function (name) {
    if ("associate" in models[name]) {
        models[name].associate(models);
    }
});
models.Sequalize = _sequelize2.default;
models.conn = _db.conn;
models.config = _db.config;
module.exports = models;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(models, "models", "api/models.js");
    leaveModule(module);
})();

;