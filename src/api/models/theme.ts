import { DataTypes, Model } from "sequelize";

class Theme extends Model {
  static associate(_models) {}

  static init(sequelize) {
    super.init.call(
      this,
      {
        name: {
          type: DataTypes.STRING,
        },
        value: {
          type: DataTypes.TEXT,
        },
        settings: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        freezeTableName: true,
        timestamps: false,
      },
    );
    return Theme;
  }
}

export default Theme;
