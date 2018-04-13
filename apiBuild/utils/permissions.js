"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.checkDisplayAccess = exports.editPostPerm = exports.createPostsPerm = exports.requiresAdmin = exports.requiresAuth = undefined;

var _common = require("./common");

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var createResolver = function createResolver(resolver) {
    var baseResolver = resolver;
    baseResolver.createResolver = function (childResolver) {
        var newResolver = async function newResolver(root, args, context) {
            var newArgs = await resolver(root, args, context);
            return childResolver(root, newArgs, context);
        };
        return createResolver(newResolver);
    };
    return baseResolver;
};

var requiresAuth = exports.requiresAuth = createResolver(function (root, args, context) {
    if (!context.user || !context.user.id) {
        var operationName = "server";
        if (root.body && root.body.operationName) {
            operationName = root.body.operationName;
        }
        throw new _common.UnauthorizedError({ url: operationName });
    }
    return args;
});

var requiresAdmin = exports.requiresAdmin = requiresAuth.createResolver(function (root, args, context) {
    if (context.error) {
        throw new _common.UnauthorizedError({ error: context.error });
    }
    if (!context.user.role == "ADMIN") {
        var operationName = "server";
        if (root.body && root.body.operationName) {
            operationName = root.body.operationName;
        }
        throw new _common.UnauthorizedError({ url: operationName });
    }
    return args;
});

var createPostsPerm = exports.createPostsPerm = requiresAuth.createResolver(function (root, args, context) {
    var contains = ["MANAGE_OWN_POSTS", "MANAGE_ALL_POSTS"].filter(function (i) {
        return context.user.permissions.includes(i);
    });
    if (contains.length == 0) {
        var operationName = "server";
        if (root.body && root.body.operationName) {
            operationName = root.body.operationName;
        }
        throw new _common.UnauthorizedError({ url: operationName });
    }
    return args;
});
var editPostPerm = exports.editPostPerm = requiresAuth.createResolver(function (root, args, context) {
    if (context.user.permissions.indexOf("MANAGE_OWN_POSTS") >= 0) {
        args.author_id = context.user.id;
        return args;
    } else if (context.user.permissions.indexOf("MANAGE_ALL_POSTS") >= 0) {
        return args;
    }
    var operationName = "server";
    if (root.body && root.body.operationName) {
        operationName = root.body.operationName;
    }
    throw new _common.UnauthorizedError({ url: operationName });
});

var checkDisplayAccess = exports.checkDisplayAccess = createResolver(function (root, args, context) {
    //  if this is enduser, he should see only public posts.
    var operationName = "server";
    if (!context.user || !context.user.id) {
        // if (args.status != "publish") {
        if (root.body && root.body.operationName) {
            operationName = root.body.operationName;
        }
        //     throw new UnauthorizedError({ url: operationName });
        // }
        args.status = "publish";
        return args;
    }

    if (context.error) {
        throw new _common.UnauthorizedError({ url: operationName });
    }
    //  Author should not see others posts from admin panel
    if (context.user.permissions.indexOf("MANAGE_OWN_POSTS") >= 0) {
        args.author_id = context.user.id;
        return args;
    } else if (context.user.permissions.indexOf("MANAGE_ALL_POSTS") >= 0 || context.user.permissions.indexOf("READ_ONLY_POSTS") >= 0) {
        return args;
    }
    throw new _common.UnauthorizedError({ url: root.body.operationName });
});
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(createResolver, "createResolver", "api/utils/permissions.js");
    reactHotLoader.register(requiresAuth, "requiresAuth", "api/utils/permissions.js");
    reactHotLoader.register(requiresAdmin, "requiresAdmin", "api/utils/permissions.js");
    reactHotLoader.register(createPostsPerm, "createPostsPerm", "api/utils/permissions.js");
    reactHotLoader.register(editPostPerm, "editPostPerm", "api/utils/permissions.js");
    reactHotLoader.register(checkDisplayAccess, "checkDisplayAccess", "api/utils/permissions.js");
    leaveModule(module);
})();

;