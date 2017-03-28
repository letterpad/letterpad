import { conn } from "../../config/mysql.config";

export const RolePermissionModel = conn.define("role_permission_relation", {}, {
    freezeTableName: true // Model tableName will be the same as the model name
});
