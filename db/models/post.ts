import { Author } from "./author";
import { Taxonomy } from "./taxonomy";
import {
  Association,
  BelongsToManySetAssociationsMixin,
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
import { PostStatusOptions, PostTypes } from "../../lib/type-defs.graphqls";

export interface PostAttributes {
  id: number;
  // authorId: number;
  title: string;
  excerpt: string;
  html: string;
  md: string;
  md_draft: string;
  cover_image: string;
  cover_image_width: number;
  cover_image_height: number;
  type: PostTypes;
  featured: boolean;
  status: PostStatusOptions;
  slug: string;
  reading_time: string;
  publishedAt: Date;
  scheduledAt: Date;
  updatedAt: Date;
  createdAt: Date;
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
  public cover_image_width!: number;
  public cover_image_height!: number;
  public type!: PostTypes;
  public featured!: boolean;
  public status!: PostStatusOptions;
  public slug!: string;
  public reading_time!: string;
  public publishedAt!: Date;
  public scheduledAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getTaxonomies!: HasManyGetAssociationsMixin<Taxonomy>; // Note the null assertions!
  public setTaxonomies!: BelongsToManySetAssociationsMixin<Taxonomy, number>;
  public addTaxonomy!: HasManyAddAssociationMixin<Taxonomy, number>;
  public hasTaxonomy!: HasManyHasAssociationMixin<Taxonomy, Taxonomy["id"]>;
  public countTaxonomy!: HasManyCountAssociationsMixin;
  public createTaxonomy!: HasManyCreateAssociationMixin<Taxonomy>;

  public static associations: {
    tags: Association<Post, Taxonomy>;
  };
}

export default function initPost(sequelize) {
  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
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
      updatedAt: {
        type: DataTypes.DATE,
      },
      createdAt: {
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
    through: "postTaxonomies",
    as: "taxonomies",
  });
  Post.hasMany(Taxonomy);
  Post.belongsTo(Author, { foreignKey: "AuthorId" });
}
