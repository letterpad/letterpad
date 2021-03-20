import { Author } from "./author";
import { PostTaxonomy } from "./postTaxonomy";
import { Taxonomy } from "./taxonomy";
import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
} from "sequelize";
import config from "../../config";

export interface PostAttributes {
  id: number;
  // authorId: number;
  title: string;
  excerpt: string;
  html: string;
  md: string;
  md_draft: string;
  cover_image: string;
  cover_image_width: string;
  cover_image_height: string;
  type: string;
  featured: boolean;
  status: string;
  slug: string;
  reading_time: string;
  publishedAt: Date;
  scheduledAt: Date;
}

export interface PostCreationAttributes
  extends Optional<PostAttributes, "id"> {}

export class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes {
  public id!: number;
  public authorId!: number;
  public title!: string;
  public excerpt!: string;
  public html!: string;
  public md!: string;
  public md_draft!: string;
  public cover_image!: string;
  public cover_image_width!: string;
  public cover_image_height!: string;
  public type!: string;
  public featured!: boolean;
  public status!: string;
  public slug!: string;
  public reading_time!: string;
  public publishedAt!: Date;
  public scheduledAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getTaxonomies!: HasManyGetAssociationsMixin<Taxonomy>; // Note the null assertions!
  public addTaxonomies!: HasManyAddAssociationMixin<Taxonomy, number>;
  public hasTaxonomy!: HasManyHasAssociationMixin<Taxonomy, number>;
  public countTaxonomy!: HasManyCountAssociationsMixin;
  public createTaxonomy!: HasManyCreateAssociationMixin<Taxonomy>;
}

export default function initPost(sequelize) {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        defaultValue: config.defaultTitle,
      },
      html: {
        type: DataTypes.TEXT,
      },
      md: {
        type: DataTypes.TEXT,
      },
      md_draft: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      excerpt: {
        type: DataTypes.STRING(400),
        defaultValue: "",
      },
      cover_image: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      cover_image_width: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      cover_image_height: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "draft",
      },
      slug: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      reading_time: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      publishedAt: {
        type: DataTypes.DATE,
      },
      scheduledAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "posts",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Post;
}

export function associatePost(): void {
  Post.belongsToMany(Taxonomy, {
    through: "PostTaxonomy",
    as: "taxonomies",
  });
  Post.hasMany(PostTaxonomy);
  Post.belongsTo(Author, { foreignKey: "authorId" });
}
