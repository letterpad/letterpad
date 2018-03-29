import { conn, config } from "../config/db.config";
import Sequalize, { DataTypes } from "sequelize";

const models = {
    Author: conn.import("./models/author"),
    Post: conn.import("./models/post"),
    Taxonomy: conn.import("./models/taxonomy"),
    Role: conn.import("./models/role"),
    Permission: conn.import("./models/permission"),
    Setting: conn.import("./models/settings"),
    Media: conn.import("./models/media"),
    PostTaxonomy: conn.import("./models/postTaxonomy")
};
Object.keys(models).forEach(name => {
    if ("associate" in models[name]) {
        models[name].associate(models);
    }
});
models.Sequalize = Sequalize;
models.conn = conn;
models.config = config;
module.exports = models;
