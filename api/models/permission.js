import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

export const PermissionModel = conn.define(
    "permissions",
    {
        name: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);
