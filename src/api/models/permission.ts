import { Model, DataTypes } from "sequelize";

class Permission extends Model {
  static associate(models) {
    this.belongsToMany(models.Role, {
      through: "RolePermission",
    });
  }
  static init(sequelize) {
    super.init.call(
      this,
      {
        name: DataTypes.STRING,
      },
      {
        sequelize,
        freezeTableName: true,
      },
    );
    return Permission;
  }
}

export default Permission;
