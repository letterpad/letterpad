import { getReadableDate } from "../../resolvers/helpers";
import { DataTypes, Model, Optional } from "sequelize";

import restoreSequelizeAttributesOnClass from "./_tooling";
import { Author } from "./author";

export interface MediaAttributes {
  id: number;
  url: string;
  name: string;
  width: number;
  height: number;
  description: string;
  updatedAt?: Date;
  createdAt: Date;
  author_id?: number;
}

export interface MediaCreationAttributes
  extends Optional<MediaAttributes, "id"> {}

export class Media
  extends Model<MediaAttributes, MediaCreationAttributes>
  implements MediaAttributes
{
  public id!: number;
  public name!: string;
  public url!: string;
  public width!: number;
  public height!: number;
  public description!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly author_id?: number;

  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this, []);
  }
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
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.getDataValue("updatedAt") || new Date());
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.getDataValue("createdAt") || new Date());
        },
      },
    },
    {
      tableName: "media",
      name: {
        singular: "Media",
        plural: "Media",
      },
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Media;
}

export function associateMedia() {
  Media.belongsTo(Author, {
    foreignKey: "author_id",
  });
}
