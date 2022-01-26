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

import { Upload } from "./uploads";
import {
  Role as QraphqlRole,
  Permissions as GraqhqlPermissions,
  Social,
} from "@/__generated__/__types__";
import { Setting } from "./setting";
import { Subscribers } from "./subscriber";
import { EmailDelivery } from "./emailDelivery";
import { Tag } from "./tag";

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
  verify_attempt_left?: number;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
  role_id?: number;
  setting_id?: number;
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
  public role_id!: number;
  public setting_id!: number;
  public verify_attempt_left!: number;
  // timestamps!
  public createdAt!: Date;
  public updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public addPost!: HasManyAddAssociationMixin<Post, number>;
  public createPost!: HasManyCreateAssociationMixin<Post>;
  public countPosts!: HasManyCountAssociationsMixin;
  public getPosts!: HasManyGetAssociationsMixin<Post>;
  public hasPost!: HasManyHasAssociationMixin<Post, number>;

  public addUpload!: HasManyAddAssociationMixin<Upload, number>;
  public countUploads!: HasManyCountAssociationsMixin;
  public createUpload!: HasManyCreateAssociationMixin<Upload>;
  public setUpload!: HasOneSetAssociationMixin<Upload, number>;
  public getUploads!: HasManyGetAssociationsMixin<Upload>;

  public countTags!: HasManyCountAssociationsMixin;
  public createTag!: HasManyCreateAssociationMixin<Tag>;
  public getTags!: HasManyGetAssociationsMixin<Tag>;
  public hasTag!: HasManyHasAssociationMixin<Tag, number>;

  public setRole!: HasOneSetAssociationMixin<Role, number>;
  public getRole!: HasOneGetAssociationMixin<Role>;

  public createSetting!: HasManyCreateAssociationMixin<Setting>;
  public getSetting!: HasOneGetAssociationMixin<Setting>;
  public setSetting!: HasOneSetAssociationMixin<Setting, number>;

  public getSubscribers!: HasManyGetAssociationsMixin<Subscribers>;

  public hasSubscriber!: HasManyHasAssociationMixin<Subscribers, number>;

  public addSubscriber!: HasOneSetAssociationMixin<Subscribers, number>;

  public createSubscriber!: HasManyCreateAssociationMixin<Subscribers>;
  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly posts?: Post[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    posts: Association<Author, Post>;
  };

  constructor(...args) {
    super(...args);
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
        type: new DataTypes.STRING(256),
        allowNull: true,
      },
      social: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {},
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      verify_attempt_left: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
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

  Author.hasMany(Upload, { sourceKey: "id", foreignKey: "author_id" });
  Author.hasMany(Tag, { sourceKey: "id", foreignKey: "author_id" });
  Author.hasMany(Subscribers, { sourceKey: "id", foreignKey: "author_id" });
  Author.hasMany(EmailDelivery, { sourceKey: "id", foreignKey: "author_id" });
}
