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
  intro_dismissed: boolean;
}

export interface SettingCreationAttributes
  extends Optional<SettingAttributes, "id"> {}

export class Setting
  extends Model<SettingAttributes, SettingCreationAttributes>
  implements SettingAttributes
{
  id: number = this["id"];
  site_title: string = this["site_title"];
  site_tagline: string = this["site_tagline"];
  site_email: string = this["site_email"];
  site_url: string = this["site_url"];
  site_footer: string = this["site_footer"];
  site_description: string = this["site_description"];
  subscribe_embed: string = this["subscribe_embed"];
  social_twitter: string = this["social_twitter"];
  social_facebook: string = this["social_facebook"];
  social_instagram: string = this["social_instagram"];
  social_github: string = this["social_github"];
  displayAuthorInfo: boolean = this["displayAuthorInfo"];
  cloudinary_key: string = this["cloudinary_key"];
  cloudinary_name: string = this["cloudinary_name"];
  cloudinary_secret: string = this["cloudinary_secret"];
  menu: Navigation[] = this["menu"];
  css: string = this["css"];
  google_analytics: string = this["google_analytics"];
  theme: string = this["theme"];
  banner: Image = this["banner"];
  site_logo: Image = this["site_logo"];
  site_favicon: Image = this["site_favicon"];
  client_token: string = this["client_token"];
  intro_dismissed: boolean = this["intro_dismissed"];

  readonly createdAt: Date = this["createdAt"];
  readonly updatedAt: Date = this["updatedAt"];

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
        allowNull: true,
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
        allowNull: true,
      },
      site_description: {
        type: DataTypes.STRING(500),
        defaultValue: "",
        allowNull: true,
      },
      subscribe_embed: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      social_twitter: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      social_facebook: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      social_instagram: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      social_github: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      displayAuthorInfo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      intro_dismissed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      cloudinary_key: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      cloudinary_name: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      cloudinary_secret: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      menu: {
        type: DataTypes.JSON,
      },
      css: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: true,
      },
      google_analytics: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
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
