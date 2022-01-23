import { Author } from "./author";
import { Tag } from "./tag";
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
import {
  TagsNode,
  PostStatusOptions,
  PostTypes,
  Image,
} from "@/__generated__/__types__";
import { getReadableDate } from "@/graphql/resolvers/helpers";

export interface PostAttributes {
  id: number;
  author_id: number;
  title: string;
  excerpt: string;
  html: string;
  html_draft: string;
  cover_image: Image;
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
  id: number = this["id"];
  author_id: number = this["author_id"];
  title: string = this["title"];
  excerpt: string = this["excerpt"];
  html: string = this["html"];
  html_draft: string = this["html_draft"];
  cover_image: Image = this["cover_image"];
  cover_image_width: number = this["cover_image_width"];
  cover_image_height: number = this["cover_image_height"];
  type: PostTypes = this["type"];
  featured: boolean = this["featured"];
  status: PostStatusOptions = this["status"];
  slug: string = this["slug"];
  reading_time: string = this["reading_time"];
  publishedAt: Date = this["publishedAt"];
  scheduledAt: Date = this["scheduledAt"];

  readonly createdAt: Date = this["createdAt"];
  readonly updatedAt: Date = this["updatedAt"];

  getTags: HasManyGetAssociationsMixin<Tag> = this["getTags"];
  getAuthor: BelongsToGetAssociationMixin<Author> = this["getAuthor"];
  setTags: BelongsToManySetAssociationsMixin<Tag, Tag["id"]> = this["setTags"];
  addTag: HasManyAddAssociationMixin<Tag, Tag["id"]> = this["addTag"];
  hasTagById: HasManyHasAssociationMixin<Tag, Tag["id"]> = this["hasTagById"];
  countTags: HasManyCountAssociationsMixin = this["countTags"];
  createTag: HasManyCreateAssociationMixin<Tag> = this["createTag"];

  static associations: {
    tags: Association<Post, Tag>;
  };

  constructor(...args) {
    super(...args);
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
      html_draft: {
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
        allowNull: false,
      },
      reading_time: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return getReadableDate(this.getDataValue("publishedAt"));
        },
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return this.getDataValue("scheduledAt")
            ? getReadableDate(this.getDataValue("scheduledAt"))
            : "";
        },
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
  Post.belongsToMany(Tag, {
    through: postTags.name,
    foreignKey: postTags.fk,
  });
  // Post.hasMany(Tags);
  Post.belongsTo(Author, {
    foreignKey: "author_id",
  });
  return Post;
}
