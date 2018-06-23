const config = require("../../config/db.config")[process.env.NODE_ENV];

module.exports = {
    dev: {
        storage: "data/" + config.database + ".sqlite",
        dialect: "sqlite"
    },
    production: {
        storage: "data/" + config.database + ".sqlite",
        dialect: "sqlite"
    }
};
