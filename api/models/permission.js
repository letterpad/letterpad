export default (conn, DataTypes) => {
  const Permission = conn.define(
    "permission",
    {
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true, // Model tableName will be the same as the model name
    },
  );
  Permission.associate = models => {
    Permission.belongsToMany(models.Role, {
      through: "RolePermission",
    });
  };

  return Permission;
};
