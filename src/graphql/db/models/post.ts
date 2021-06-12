import { Author } from "./author";
import { Tags } from "./tags";
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
  BelongsToGetAssociationMixin,
} from "sequelize";

import restoreSequelizeAttributesOnClass from "./_tooling";
import { getReadableDate } from "../../resolvers/helpers";
import {
  TagsNode,
  PostStatusOptions,
  PostTypes,
} from "@/__generated__/__types__";

export interface PostAttributes {
  id: number;
  author_id: number;
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
  scheduledAt?: Date;
  updatedAt: Date;
  createdAt: Date;
  tags?: TagsNode["rows"];
}

export interface PostCreationAttributes extends Optional<PostAttributes, "id"> {
  // setTags: BelongsToManySetAssociationsMixin<Tags, number>;
}

export class Post extends Model {
  public id!: number;
  public author_id!: number;
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

  public getTags!: HasManyGetAssociationsMixin<Tags>; // Note the null assertions!
  public getAuthor!: BelongsToGetAssociationMixin<Author>;
  public setTags!: BelongsToManySetAssociationsMixin<Tags, Tags["id"]>;
  public addTag!: HasManyAddAssociationMixin<Tags, Tags["id"]>;
  public hasTagById!: HasManyHasAssociationMixin<Tags, Tags["id"]>;
  public countTags!: HasManyCountAssociationsMixin;
  public createTag!: HasManyCreateAssociationMixin<Tags>;

  public static associations: {
    tags: Association<Post, Tags>;
  };

  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this, [
      "setTags",
      "getTags",
      "addTag",
      "hasTagById",
      "countTags",
      "createTag",
      "getAuthor",
    ]);
  }
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
        defaultValue: "",
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
        allowNull: true,
      },
      cover_image: {
        type: DataTypes.STRING,
        defaultValue: "",
        get() {
          if (this.cover_image && this.cover_image.startsWith("/")) {
            this.cover_image = process.env.ROOT_URL + this.cover_image;
          }
          return {
            src: this.cover_image,
            width: this.cover_image_width,
            height: this.cover_image_height,
          };
        },
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
        get() {
          return "/" + this.type + "/" + this.slug;
        },
      },
      reading_time: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return getReadableDate(this.publishedAt);
        },
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return this.scheduledAt ? getReadableDate(this.scheduledAt) : "";
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.updatedAt);
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.createdAt);
        },
      },
    },
    {
      tableName: "posts",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Post;
}

export const postTags = {
  name: "postTags",
  fk: "post_id",
};

export function associatePost() {
  Post.belongsToMany(Tags, {
    through: postTags.name,
    foreignKey: postTags.fk,
  });
  // Post.hasMany(Tags);
  Post.belongsTo(Author, {
    foreignKey: "author_id",
  });
  return Post;
}
