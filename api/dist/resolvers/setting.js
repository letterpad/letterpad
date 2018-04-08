"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _permissions = require("../utils/permissions");

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = {
    Query: {
        settings: function settings(root, args, _ref) {
            var models = _ref.models;

            return models.Setting.findAll({ where: args });
        }
    },
    Mutation: {
        updateOptions: _permissions.requiresAdmin.createResolver(async function (root, args, _ref2) {
            var models = _ref2.models;

            var promises = args.options.map(function (setting) {
                if (setting.option === "css") {
                    require("fs").writeFileSync(require("path").join(__dirname, "../../public/css/custom.css"), setting.value);
                }
                return models.Setting.update(setting, {
                    where: { option: setting.option }
                });
            });
            await Promise.all(promises);
            return models.Setting.findAll();
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

    reactHotLoader.register(_default, "default", "api/resolvers/setting.js");
    leaveModule(module);
})();

;