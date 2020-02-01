import { Model, DataTypes } from "sequelize";

class Setting extends Model {
  static associate(_models) {}
  static init(sequelize) {
    super.init.call(
      this,
      {
        option: {
          type: DataTypes.STRING,
        },
        value: {
          type: DataTypes.TEXT,
        },
      },
      {
        sequelize,
        freezeTableName: true,
      },
    );
    return Setting;
  }
}

export default Setting;
