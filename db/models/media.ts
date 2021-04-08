import { DataTypes, Model, Optional } from "sequelize";

export interface MediaAttributes {
  id: number;
  url: string;
  name: string;
  width: number;
  height: number;
  description: string;
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

  // public addTaxonomy!: HasManyAddAssociationMixin<Post, number>;
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
        type: DataTypes.NUMBER,
      },
      height: {
        type: DataTypes.NUMBER,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "media",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Media;
}
