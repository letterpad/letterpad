import { Model, DataTypes } from "sequelize";

class Media extends Model {
  static associate(_models) {}
  static init(sequelize) {
    super.init.call(
      this,
      {
        url: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        description: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        freezeTableName: true,
      },
    );
    return this;
  }
}

export default Media;
