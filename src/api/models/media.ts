import { DataTypes, Model } from "sequelize";

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
        width: {
          type: DataTypes.INTEGER,
        },
        height: {
          type: DataTypes.INTEGER,
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
