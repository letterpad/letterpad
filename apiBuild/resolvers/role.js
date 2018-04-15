"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
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