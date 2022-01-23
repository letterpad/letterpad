import { getReadableDate } from "@/graphql/resolvers/helpers";
import { DataTypes, Model, Optional } from "sequelize";
import { Author } from "./author";

export interface UploadAttributes {
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

export interface UploadCreationAttributes
  extends Optional<UploadAttributes, "id"> {}

export class Upload
  extends Model<UploadAttributes, UploadCreationAttributes>
  implements UploadAttributes
{
  id: number = this["id"];
  name: string = this["name"];
  url: string = this["url"];
  width: number = this["width"];
  height: number = this["height"];
  description: string = this["description"];

  readonly createdAt: Date = this["createdAt"];
  readonly updatedAt: Date = this["updatedAt"];

  readonly author_id?: number;

  constructor(...args) {
    super(...args);
  }
}

export default function initUpload(sequelize) {
  Upload.init(
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
      tableName: "upload",
      name: {
        singular: "Upload",
        plural: "Upload",
      },
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Upload;
}

export function associateUpload() {
  Upload.belongsTo(Author, {
    foreignKey: "author_id",
  });
}
