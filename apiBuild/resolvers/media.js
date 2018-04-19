"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _common = require("../utils/common");

var _permissions = require("../utils/permissions");

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getConditions(columns, args) {
    var obj = {};
    var conditions = {};
    for (var field in args) {
        if (columns.indexOf(field) >= 0) {
            obj[field] = IsJsonString(args[field]) ? JSON.parse(args[field]) : args[field];
        } else {
            conditions[field] = args[field];
        }
    }
    conditions.where = obj;
    return conditions;
}
var _default = {
    Query: {
        media: async function media(root, args, _ref) {
            var user = _ref.user,
                models = _ref.models;

            if (!user || !user.id) {
                throw new _common.UnauthorizedError({ url: "/media" });
            }
            var columns = Object.keys(models.Post.rawAttributes);
            var conditions = getConditions(columns, args);

            var count = await models.Media.count(conditions);
            if (args.cursor) {
                conditions.where.id = { gt: args.cursor };
            }
            var media = await models.Media.findAll(conditions);
            return {
                count: count,
                rows: media
            };
        }
    },
    Mutation: {
        insertMedia: _permissions.editPostPerm.createResolver(function (root, args, _ref2) {
            var models = _ref2.models;

            var data = {};
            Object.keys(args).forEach(function (field) {
                data[field] = args[field];
            });
            return models.Media.create(data);
        }),

        deleteMedia: _permissions.editPostPerm.createResolver(async function (root, args, _ref3) {
            var models = _ref3.models;

            var destroyedRecord = await models.Media.destroy({
                where: { id: args.id }
            });
            if (destroyedRecord == 1) {
                return {
                    ok: true,
                    id: args.id
                };
            }
            return { ok: false };
        })
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

    reactHotLoader.register(IsJsonString, "IsJsonString", "api/resolvers/media.js");
    reactHotLoader.register(getConditions, "getConditions", "api/resolvers/media.js");
    reactHotLoader.register(_default, "default", "api/resolvers/media.js");
    leaveModule(module);
})();

;