import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

export const RolePermissionModel = conn.define(
    "role_per_relation",
    {},
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);
