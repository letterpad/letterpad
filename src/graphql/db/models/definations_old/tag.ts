import { Post } from "./post";
import {
  BelongsToManySetAssociationsMixin,
  DataTypes,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  Model,
  Optional,
} from "sequelize";

import { PostsResponse } from "@/__generated__/__types__";

export interface TagsAttributes {
  readonly id: number;
  name: string;
  desc: string;
  slug: string;
  posts?: PostsResponse;
  author_id?: number;
}

export interface TagsCreationAttributes
  extends Optional<TagsAttributes, "id"> {}

export class Tag
  extends Model<TagsAttributes, TagsCreationAttributes>
  implements TagsAttributes
{
  id: number = this["id"];
  name: string = this["name"];
  desc: string = this["desc"];
  slug: string = this["slug"];
  author_id: number = this["author_id"];

  readonly createdAt: Date = this["createdAt"];
  readonly updatedAt: Date = this["updatedAt"];
  public readonly posts!: PostsResponse;

  getPosts: HasManyGetAssociationsMixin<Post> = this["getPosts"]; // Note the null assertions!
  createPost: HasManyCreateAssociationMixin<Post> = this["createPost"]; // Note the null assertions!
  hasPost: HasManyHasAssociationMixin<Post, Post["id"]> = this["hasPost"];
  countPosts: HasManyCountAssociationsMixin = this["countPosts"];
  setPosts: BelongsToManySetAssociationsMixin<Post, Post["id"]> =
    this["setPosts"];

  constructor(...args) {
    super(...args);
  }
}

export default function initTags(sequelize) {
  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      slug: {
        type: DataTypes.STRING,
        get() {
          return "/tag/" + this.getDataValue("slug");
        },
      },
    },
    {
      tableName: "tags",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Tag;
}

export function associateTags(): void {
  // Here we associate which actually populates out pre-declared `association` static and other methods.
  Tag.belongsToMany(Post, {
    through: "postTags",
    foreignKey: "tag_id",
  });
}
