"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mail = require("../utils/mail");

var _mail2 = _interopRequireDefault(_mail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    Mutation: {
        sendMail: async function sendMail(root, args, _ref) {
            var models = _ref.models;

            (0, _mail2.default)(args, function (error, info) {
                //...
            });
        }
    }
};