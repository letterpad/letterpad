"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _default = "\n  type Author {\n    id: Int\n    username: String\n    email: String\n    fname: String\n    lname: String\n    social: String\n    role: Role\n    avatar: String\n  }\n\n  type LoginResponse {\n    ok: Boolean!\n    token: String\n    data: Author\n    errors: [Error!]\n  }\n\n  type ForgotPasswordResponse {\n    ok: Boolean!\n    msg: String\n  }\n\n  type AuthorResponse {\n    ok: Boolean!\n    errors: [Error!]\n    data: Author\n  }\n\n  type CreateAuthorResponse {\n    ok: Boolean!\n    errors: [Error!]\n  }\n\n  type Query {\n    author(id: Int!, username: String): Author\n    authors: [Author]\n    me: Author\n  }\n\n  type Mutation {\n    register(username: String!, password: String!, email: String!): AuthorResponse!\n    login(username: String, email: String, password: String!, remember: Boolean): LoginResponse!\n    forgotPassword(email: String!): ForgotPasswordResponse!\n    resetPassword(password: String!, token: String!): ForgotPasswordResponse!\n    updateAuthor(id: Int!, username: String, email: String, fname: String, lname: String, social: String, password: String, role_id: Int, avatar: String): AuthorResponse\n    createAuthor(email: String!, fname: String, lname: String, role_id: Int): CreateAuthorResponse\n  }\n";
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "api/schema/author.js");
  leaveModule(module);
})();

;