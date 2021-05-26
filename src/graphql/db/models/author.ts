import { Role } from "./role";
import { Post } from "./post";
import {
  Sequelize,
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from "sequelize";
import restoreSequelizeAttributesOnClass from "./_tooling";

import { Media } from "./media";
import {
  Social,
  Role as QraphqlRole,
  Permissions as GraqhqlPermissions,
} from "@/__generated__/type-defs.graphqls";
import { Setting } from "./setting";
import { Tags } from "./tags";

// These are all the attributes in the User model
export interface AuthorAttributes {
  id: number;
  name: string;
  email: string;
  bio: string;
  password: string;
  avatar: string;
  social: Social;
  verified: boolean;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthorCreationAttributes extends Optional<AuthorAttributes, "id"> {}

export class Author
  extends Model<AuthorAttributes, AuthorCreationAttributes>
  implements AuthorAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public bio!: string;
  public password!: string;
  public avatar!: string;
  public username!: string;
  public verified!: boolean;
  public social!: Social;
  public role!: QraphqlRole;
  public permissions!: GraqhqlPermissions[];

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public addPost!: HasManyAddAssociationMixin<Post, number>;
  public createPost!: HasManyCreateAssociationMixin<Post>;
  public countPosts!: HasManyCountAssociationsMixin;
  public getPosts!: HasManyGetAssociationsMixin<Post>; // Note the null assertions!
  public hasPost!: HasManyHasAssociationMixin<Post, number>;

  public addMedia!: HasManyAddAssociationMixin<Media, number>;
  public countMedia!: HasManyCountAssociationsMixin;
  public createMedia!: HasManyCreateAssociationMixin<Media>;
  public setMedia!: HasOneSetAssociationMixin<Media, number>;
  public getMedia!: HasManyGetAssociationsMixin<Media>; // Note the null assertions!

  public countTags!: HasManyCountAssociationsMixin;
  public createTag!: HasManyCreateAssociationMixin<Tags>;
  public getTags!: HasManyGetAssociationsMixin<Tags>;
  public hasTag!: HasManyHasAssociationMixin<Tags, number>;

  public setRole!: HasOneSetAssociationMixin<Role, number>;
  public getRole!: HasOneGetAssociationMixin<Role>;

  public createSetting!: HasManyCreateAssociationMixin<Setting>;
  public getSetting!: HasOneGetAssociationMixin<Setting>;
  public setSetting!: HasOneSetAssociationMixin<Setting, number>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly posts?: Post[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    posts: Association<Author, Post>;
  };

  constructor(...args) {
    super(...args);
    restoreSequelizeAttributesOnClass(new.target, this, [
      "getPosts",
      "addPost",
      "hasPost",
      "countPosts",
      "countTags",
      "countMedia",
      "getMedia",
      "addMedia",
      "createPost",
      "setRole",
      "getRole",
      "setSetting",
      "getSetting",
      "createTag",
      "getTags",
      "hasTag",
      "createSetting",
    ]);
  }
}
export default function initAuthor(sequelize: Sequelize) {
  Author.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      username: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      bio: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      avatar: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      social: {
        type: new DataTypes.STRING(128),
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "authors",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Author;
}

export function associateAuthor(): void {
  Author.hasMany(Post, {
    sourceKey: "id",
    foreignKey: "author_id",
  });

  Author.belongsTo(Role, { as: "role", foreignKey: "role_id" });
  Author.belongsTo(Setting, { as: "setting", foreignKey: "setting_id" });

  Author.hasMany(Media, { sourceKey: "id", foreignKey: "author_id" });
  Author.hasMany(Tags, { sourceKey: "id", foreignKey: "author_id" });
}
