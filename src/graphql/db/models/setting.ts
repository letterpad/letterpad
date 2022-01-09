import { DataTypes, Model, Optional } from "sequelize";
import { Author } from "./author";
import { Image, Navigation } from "@/__generated__/__types__";

export interface SettingAttributes {
  id: number;
  site_title: string;
  site_tagline: string;
  site_email: string;
  site_url: string;
  site_footer: string;
  site_description: string;
  subscribe_embed: string;
  social_twitter: string;
  social_facebook: string;
  social_instagram: string;
  social_github: string;
  displayAuthorInfo: boolean;
  cloudinary_key: string;
  cloudinary_name: string;
  cloudinary_secret: string;
  menu: Navigation[];
  css: string;
  google_analytics: string;
  theme: string;
  banner: Image;
  site_logo: Image;
  site_favicon: Image;
  client_token: string;
}

export interface SettingCreationAttributes
  extends Optional<SettingAttributes, "id"> {}

export class Setting
  extends Model<SettingAttributes, SettingCreationAttributes>
  implements SettingAttributes
{
  public id!: number;
  public site_title!: string;
  public site_tagline!: string;
  public site_email!: string;
  public site_url!: string;
  public site_footer!: string;
  public site_description!: string;
  public subscribe_embed!: string;
  public social_twitter!: string;
  public social_facebook!: string;
  public social_instagram!: string;
  public social_github!: string;
  public displayAuthorInfo!: boolean;
  public cloudinary_key!: string;
  public cloudinary_name!: string;
  public cloudinary_secret!: string;
  public menu!: Navigation[];
  public css!: string;
  public google_analytics!: string;
  public theme!: string;
  public banner!: Image;
  public site_logo!: Image;
  public site_favicon!: Image;
  public client_token!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(...args) {
    super(...args);
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
      site_title: {
        type: DataTypes.STRING(100),
        defaultValue: "",
      },
      site_tagline: {
        type: DataTypes.STRING(160),
        defaultValue: "",
      },
      site_email: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      site_url: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      site_footer: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      site_description: {
        type: DataTypes.STRING(500),
        defaultValue: "",
      },
      subscribe_embed: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      social_twitter: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      social_facebook: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      social_instagram: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      social_github: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      displayAuthorInfo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      cloudinary_key: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      cloudinary_name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      cloudinary_secret: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      menu: {
        type: DataTypes.JSON,
      },
      css: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      google_analytics: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      theme: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      client_token: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      banner: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      site_logo: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
      site_favicon: {
        type: DataTypes.JSON,
        defaultValue: {},
      },
    },
    {
      tableName: "settings",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Setting;
}

export function associateSetting(): void {
  Setting.belongsTo(Author, {
    foreignKey: "setting_id",
  });
}
