var Sequelize = require("sequelize");
var env = process.env.NODE_ENV || "dev";
var config = require("../../config/db.config.js")[env];
var db = {};

// establish  database connection
const conn = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

const models = {
    Author: conn.import("./author"),
    Post: conn.import("./post"),
    Taxonomy: conn.import("./taxonomy"),
    Role: conn.import("./role"),
    Permission: conn.import("./permission"),
    Setting: conn.import("./settings"),
    Media: conn.import("./media"),
    PostTaxonomy: conn.import("./postTaxonomy")
};

// now that we have the model instances, add relationships
Object.keys(models).forEach(function(modelName) {
    db[modelName] = models[modelName];
    if (db[modelName].associate) {
        db[modelName].associate(models);
    }
});

db.sequelize = conn;
db.Sequelize = Sequelize;

module.exports = db;
