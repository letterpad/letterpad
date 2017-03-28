import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

export const RoleModel = conn.define(
    "roles",
    {
        name: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);
