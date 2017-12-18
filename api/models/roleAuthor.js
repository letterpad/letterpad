import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

export const RoleAuthorModel = conn.define(
    "role_author_relation",
    {},
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);
