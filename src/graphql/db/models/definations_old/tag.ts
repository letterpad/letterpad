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
  id: number;
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
  public id!: number;
  public name!: string;
  public desc!: string;
  public slug!: string;
  public author_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly posts!: PostsResponse;

  public getPosts!: HasManyGetAssociationsMixin<Post>; // Note the null assertions!
  public createPost!: HasManyCreateAssociationMixin<Post>; // Note the null assertions!
  public hasPostById!: HasManyHasAssociationMixin<Post, Post["id"]>;
  public countPosts!: HasManyCountAssociationsMixin;
  public setPosts!: BelongsToManySetAssociationsMixin<Post, Post["id"]>;

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
