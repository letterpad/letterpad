var env = require("node-env-file");
env(__dirname + "/../../.env");
module.exports = {
    dev: {
        storage: "data/" + process.env.DB_NAME + ".sqlite",
        dialect: "sqlite"
    },
    production: {
        storage: "data/" + process.env.DB_NAME + ".sqlite",
        dialect: "sqlite"
    }
};
