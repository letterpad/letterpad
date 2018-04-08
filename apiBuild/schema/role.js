"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

var _default = "\n  type Role {\n    id: Int\n    name: String\n    permissions: [Permission]\n  }\n  type Permission {\n    id: Int\n    name: String\n  }\n  type Query {\n    roles: [Role]\n  }\n";
exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, "default", "api/schema/role.js");
  leaveModule(module);
})();

;