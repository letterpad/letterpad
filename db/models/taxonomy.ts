import { PostTaxonomy } from "./postTaxonomy";
import { Post } from "./post";
import { DataTypes, Model, Optional } from "sequelize";
import config from "../../config";

export interface TaxonomyAttributes {
  id: number;
  name: string;
  desc: string;
  slug: string;
  type: string;
}

export interface TaxonomyCreationAttributes
  extends Optional<TaxonomyAttributes, "id"> {}

export class Taxonomy
  extends Model<TaxonomyAttributes, TaxonomyCreationAttributes>
  implements TaxonomyAttributes {
  public id!: number;
  public name!: string;
  public desc!: string;
  public slug!: string;
  public type!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public addTaxonomy!: HasManyAddAssociationMixin<Post, number>;
}

export default function initTaxonomy(sequelize) {
  Taxonomy.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
      desc: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
      slug: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
    },
    {
      tableName: "taxonomies",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Taxonomy;
}

export function associateTaxonomy(): void {
  // Here we associate which actually populates out pre-declared `association` static and other methods.
  Taxonomy.belongsToMany(Post, {
    through: Taxonomy,
    // as: "posttaxonomy",
  });
}
