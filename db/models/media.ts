import { getReadableDate } from "./../../lib/resolvers/helpers";
import { DataTypes, Model, Optional } from "sequelize";
import config from "../../config";

export interface MediaAttributes {
  id: number;
  url: string;
  name: string;
  width: number;
  height: number;
  description: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface MediaCreationAttributes
  extends Optional<MediaAttributes, "id"> {}

export class Media
  extends Model<MediaAttributes, MediaCreationAttributes>
  implements MediaAttributes {
  public id!: number;
  public name!: string;
  public url!: string;
  public width!: number;
  public height!: number;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public addTags!: HasManyAddAssociationMixin<Post, number>;
}

export default function initMedia(sequelize) {
  Media.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
        get() {
          if (this.getDataValue("url").startsWith("/")) {
            return config.BASE_NAME + this.getDataValue("url");
          }
          return this.getDataValue("url");
        },
      },
      width: {
        type: DataTypes.NUMBER,
      },
      height: {
        type: DataTypes.NUMBER,
      },
      description: {
        type: DataTypes.STRING,
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.getDataValue("updatedAt"));
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.getDataValue("createdAt"));
        },
      },
    },
    {
      tableName: "media",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Media;
}
