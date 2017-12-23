import Sequalize from "sequelize";

export default (conn, DataTypes) => {
    const Permission = conn.define(
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
    Permission.associate = models => {
        Permission.belongsToMany(models.Role, {
            through: "RolePermission"
        });
    };

    return Permission;
};
