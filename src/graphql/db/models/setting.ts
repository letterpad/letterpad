import { DataTypes, Model, Optional } from "sequelize";
import config from "../../../../config";
import {
  Navigation,
  Setting as Option,
} from "@/__generated__/type-defs.graphqls";
import restoreSequelizeAttributesOnClass from "./_tooling";
const host = config.ROOT_URL;
interface ModelOption extends Option {}

type ValueOf<T> = T[keyof T];

export interface SettingAttributes {
  id: number;
  option: keyof ModelOption;
  value: ValueOf<ModelOption>;
}

export interface SettingCreationAttributes
  extends Optional<SettingAttributes, "id"> {}

export class Setting
  extends Model<SettingAttributes, SettingCreationAttributes>
  implements SettingAttributes {
  public id!: number;
  public option!: keyof Option;
  public value!: ValueOf<ModelOption>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this, []);
  }
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
      },
      value: {
        type: DataTypes.STRING,
        get() {
          const option = this.getDataValue("option") as keyof ModelOption;
          const value = this.value;
          if (["banner", "site_logo", "site_favicon"].includes(option)) {
            const img = JSON.parse(value as string);
            img.src = host + img.src;
            return img;
          }
          if (option === "menu") {
            return getMenuWithSanitizedSlug(JSON.parse(value as string));
          }
          return value;
        },
      },
    },
    {
      tableName: "settings",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Setting;
}

function getMenuWithSanitizedSlug(menu: Navigation[]) {
  return menu.map(item => {
    switch (item.type) {
      case "tag":
      case "page":
        item.slug = "/" + item.type + "/" + item.slug;
        break;
      case "custom":
        item.slug = config.BASE_NAME + "/" + item.slug;
        break;
    }
    return item;
  });
}
