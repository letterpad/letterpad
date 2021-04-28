import { DataTypes, Model, Optional } from "sequelize";
import { Navigation } from "@/__generated__/type-defs.graphqls";
import restoreSequelizeAttributesOnClass from "./_tooling";
import jwt from "jsonwebtoken";

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
  menu: string;
  css: string;
  google_analytics: string;
  locale: string;
  theme: string;
  disqus_id: string;
  banner: string;
  site_logo: string;
  site_favicon: string;
  client_token: string;
}

export interface SettingCreationAttributes
  extends Optional<SettingAttributes, "id"> {}

export class Setting
  extends Model<SettingAttributes, SettingCreationAttributes>
  implements SettingAttributes {
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
  public menu!: string;
  public css!: string;
  public google_analytics!: string;
  public locale!: string;
  public theme!: string;
  public disqus_id!: string;
  public banner!: string;
  public site_logo!: string;
  public site_favicon!: string;
  public client_token!: string;

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
      site_title: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      site_tagline: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        defaultValue: "",
        get() {
          const value = this.menu;
          return getMenuWithSanitizedSlug(JSON.parse(value as string));
        },
      },
      css: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      google_analytics: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      locale: {
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
      disqus_id: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      banner: {
        type: DataTypes.STRING,
        defaultValue: "",
        get() {
          const value = this.banner;
          const img = JSON.parse(value as string);
          if (!img.src.startsWith("http")) {
            img.src = process.env.ROOT_URL + img.src;
          }
          return img;
        },
      },
      site_logo: {
        type: DataTypes.STRING,
        defaultValue: "",
        get() {
          const value = this.site_logo;
          const img = JSON.parse(value as string);
          if (!img.src.startsWith("http")) {
            img.src = process.env.ROOT_URL + img.src;
          }
          return img;
        },
      },
      site_favicon: {
        type: DataTypes.STRING,
        defaultValue: "",
        get() {
          const value = this.site_favicon;
          const img = JSON.parse(value as string);
          if (!img.src.startsWith("http")) {
            img.src = process.env.ROOT_URL + img.src;
          }
          return img;
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
        item.slug = item.slug;
        break;
    }
    return item;
  });
}
