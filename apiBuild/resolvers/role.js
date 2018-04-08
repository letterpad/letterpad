"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = {
    Query: {
        roles: function roles(root, args, _ref) {
            var models = _ref.models;

            return models.Role.findAll();
        }
    },
    Role: {
        permissions: function permissions(role) {
            return role.getPermissions();
        }
    }
};
exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(_default, "default", "api/resolvers/role.js");
    leaveModule(module);
})();

;