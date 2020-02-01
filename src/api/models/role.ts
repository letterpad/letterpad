import { Model, DataTypes } from "sequelize";

class Role extends Model {
  static associate(models) {
    this.belongsToMany(models.Permission, {
      through: "RolePermission",
    });
    this.hasMany(models.Author);
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
    return Role;
  }
}
export default Role;
