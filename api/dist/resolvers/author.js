"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _util = require("../../shared/util");

var _permissions = require("../utils/permissions");

var _author = require("../models/author");

var _util2 = require("util");

var _config = require("../../config");

var _config2 = _interopRequireDefault(_config);

var _mail = require("../utils/mail");

var _mail2 = _interopRequireDefault(_mail);

var _common = require("../utils/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = {
    Query: {
        author: function author(root, args, _ref) {
            var models = _ref.models;
            return models.Author.findOne({ where: args });
        },
        authors: function authors(root, args, _ref2) {
            var models = _ref2.models;
            return models.Author.findAll({ where: args });
        },

        me: function me(req, args, _ref3) {
            var user = _ref3.user,
                models = _ref3.models;
            return models.Author.findOne({ where: { id: user.id } });
        }
    },
    Mutation: {
        login: async function login(root, _ref4, _ref5) {
            var email = _ref4.email,
                password = _ref4.password,
                remember = _ref4.remember;
            var SECRET = _ref5.SECRET,
                models = _ref5.models;

            var author = await models.Author.findOne({ where: { email: email } });

            if (!author) {
                return {
                    ok: false,
                    token: "",
                    errors: [{
                        path: "Login",
                        message: "We couldnt find this email."
                    }]
                };
            }
            var valid = await _bcryptjs2.default.compare(password, author.password);

            if (!valid) {
                return {
                    ok: false,
                    token: "",
                    errors: [{
                        path: "Login",
                        message: "We couldn't authenticate your credentials"
                    }]
                };
            }
            var role = await models.Role.findOne({
                where: { id: author.role_id }
            });
            var perms = await role.getPermissions();
            var permissionNames = perms.map(function (perm) {
                return perm.name;
            }); //test
            var expiresIn = remember ? "30d" : "1d";

            var token = _jsonwebtoken2.default.sign({
                email: email,
                id: author.id,
                role: role.name,
                permissions: permissionNames,
                name: author.fname,
                expiresIn: expiresIn
            }, SECRET, { expiresIn: expiresIn });
            return {
                ok: true,
                token: token,
                errors: []
            };
        },
        register: async function register(root, args, _ref6) {
            var models = _ref6.models;

            var author = _extends({}, args);
            try {
                var user = await models.Author.findOne({
                    attributes: ["email"],
                    where: { email: author.email }
                });
                if (user) {
                    throw new Error("Email already exist");
                }

                author.password = await _bcryptjs2.default.hash(author.password, 12);
                author.role_id = 1;
                var res = models.Author.create(author);

                return {
                    ok: true,
                    data: res,
                    errors: []
                };
            } catch (e) {
                return {
                    ok: false,
                    data: null,
                    errors: [{ message: e.message, path: "Register" }]
                };
            }
        },
        updateAuthor: _permissions.requiresAdmin.createResolver(async function (root, args, _ref7) {
            var models = _ref7.models;

            try {
                var newArgs = _extends({}, args);
                if (args.password) {
                    newArgs.password = await _bcryptjs2.default.hash(args.password, 12);
                }
                await models.Author.update(newArgs, {
                    where: { id: newArgs.id }
                });
                return {
                    ok: true,
                    errors: []
                };
            } catch (e) {
                return {
                    ok: false,
                    errors: (0, _util.parseErrors)(e)
                };
            }
        }),
        createAuthor: _permissions.requiresAdmin.createResolver(async function (root, args, _ref8) {
            var models = _ref8.models;

            try {
                var newArgs = _extends({}, args);

                var author = await models.Author.findOne({
                    where: { email: newArgs.email }
                });
                if (author) {
                    return {
                        ok: false,
                        errors: [{
                            message: "Email already exist",
                            path: "createAuthor"
                        }]
                    };
                }

                var randomPassword = Math.random().toString(36).substr(2);
                newArgs.password = await _bcryptjs2.default.hash(randomPassword, 12);

                await models.Author.create(newArgs, {
                    where: { id: newArgs.id }
                });
                var role = await models.Role.findOne({
                    where: { id: newArgs.role_id }
                });

                var variables = {
                    name: newArgs.fname,
                    email: newArgs.email,
                    password: randomPassword,
                    rolename: role.name
                };
                var body = await (0, _common.getEmailBody)("register", variables, models);

                var success = await (0, _mail2.default)({
                    to: newArgs.email,
                    subject: "Account Created",
                    body: body
                });
                return {
                    ok: true,
                    errors: []
                };
            } catch (e) {
                return {
                    ok: false,
                    errors: (0, _util.parseErrors)(e)
                };
            }
        }),
        forgotPassword: async function forgotPassword(root, args, _ref9) {
            var models = _ref9.models;

            try {
                var email = args.email;
                var token = Math.random().toString(36).substr(2);
                var author = await models.Author.findOne({
                    where: { email: email }
                });
                if (!author) {
                    throw new Error("Email does not exist");
                }
                await models.Author.update({ token: token }, { where: { id: author.id } });
                var link = (0, _util.makeUrl)(["/admin/reset-password", token]);
                var role = await models.Role.findOne({
                    where: { id: author.role_id }
                });

                var variables = {
                    name: author.fname,
                    email: args.email,
                    link: link
                };
                var body = await (0, _common.getEmailBody)("password_reset", variables, models);
                var success = await (0, _mail2.default)({
                    to: email,
                    subject: "Password Reset",
                    body: body
                });

                return {
                    ok: true,
                    msg: "Check your email to recover your password"
                };
            } catch (e) {
                return {
                    ok: false,
                    msg: "Something unexpected happened"
                };
            }
        },
        resetPassword: async function resetPassword(root, args, _ref10) {
            var models = _ref10.models;

            try {
                var token = args.token;
                var password = await _bcryptjs2.default.hash(args.password, 12);
                var author = await models.Author.findOne({
                    where: { token: token }
                });

                if (!author) {
                    throw new Error("Invalid token for changing password");
                }
                await models.Author.update({ token: "", password: password }, { where: { id: author.id } });

                return {
                    ok: true,
                    msg: "Password changed successfully"
                };
            } catch (e) {
                return {
                    ok: false,
                    msg: e.message
                };
            }
        }
    },
    Author: {
        role: function role(author) {
            return author.getRole();
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

    reactHotLoader.register(_default, "default", "api/resolvers/author.js");
    leaveModule(module);
})();

;