const config = require("../packages/config/prettier.config");

module.exports = {
  ...config,
  singleQuote: false,
  trailingComma: "es5",
};
