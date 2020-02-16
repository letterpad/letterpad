const path = require("path");

module.exports = {
  resolve: {
    alias: {
      admin: path.resolve(__dirname, "/../src/admin"),
      client: path.resolve(__dirname, "/../src/client"),
      shared: path.resolve(__dirname, "/../src/shared"),
      config: path.resolve(__dirname, "/../src/config"),
    },
  },
};
