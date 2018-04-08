"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mail = require("../utils/mail");

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = {
    Mutation: {
        sendMail: async function sendMail(root, args, _ref) {
            var models = _ref.models;

            (0, _mail2.default)(args, function (error, info) {
                //...
            });
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

    reactHotLoader.register(_default, "default", "api/resolvers/mail.js");
    leaveModule(module);
})();

;