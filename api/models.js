import { conn } from "../config/mysql.config";
import Sequalize, { DataTypes } from "sequelize";

const models = {
    Author: conn.import("./models/author"),
    Post: conn.import("./models/post"),
    Taxonomy: conn.import("./models/taxonomy"),
    Role: conn.import("./models/role"),
    Permission: conn.import("./models/permission"),
    Setting: conn.import("./models/settings")
};

Object.keys(models).map(name => {
    if ("associate" in models[name]) {
        models[name].associate(models);
    }
});
models.Sequalize = Sequalize;
models.conn = conn;

module.exports = models;
