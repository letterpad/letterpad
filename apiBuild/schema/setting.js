"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type Setting {\n    id: Int\n    option: String\n    value: String\n  }\n  input OptionInputType {\n    id: Int\n    option: String\n    value: String\n  }\n  \n  type Query {\n    settings(option: String):[Setting]\n  }\n\n  type Mutation {\n    updateOptions(options:[OptionInputType]): [Setting]\n  }\n";