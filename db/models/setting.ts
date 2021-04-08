import { DataTypes, Model, Optional } from "sequelize";
import config from "../../config";

export interface SettingAttributes {
  id: number;
  option: string;
  value: string;
}

export interface SettingCreationAttributes
  extends Optional<SettingAttributes, "id"> {}

export class Setting
  extends Model<SettingAttributes, SettingCreationAttributes>
  implements SettingAttributes {
  public id!: number;
  public option!: string;
  public value!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export default function initSetting(sequelize) {
  Setting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      option: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
      value: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
    },
    {
      tableName: "settings",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Setting;
}
