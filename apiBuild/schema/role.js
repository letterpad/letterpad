"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type Role {\n    id: Int\n    name: String\n    permissions: [Permission]\n  }\n  type Permission {\n    id: Int\n    name: String\n  }\n  type Query {\n    roles: [Role]\n  }\n";