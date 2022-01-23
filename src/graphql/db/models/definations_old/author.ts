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
  constructor(...args) {
    super(...args);
  }

  id: number = this["id"];
  name: string = this["name"];
  email: string = this["email"];
  bio: string = this["bio"];
  password: string = this["password"];
  avatar: string = this["avatar"];
  username: string = this["username"];
  verified: boolean = this["verified"];
  social: Social = this["social"];
  role: QraphqlRole = this["role"];
  permissions: GraqhqlPermissions[] = this["permissions"];
  role_id: number = this["role_id"];
  setting_id: number = this["setting_id"];
  verify_attempt_left: number = this["verify_attempt_left"];
  // timestamps!
  createdAt: Date = this["createdAt"];
  updatedAt: Date = this["updatedAt"];

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  addPost: HasManyAddAssociationMixin<Post, number> = this["addPost"];
  createPost: HasManyCreateAssociationMixin<Post> = this["createPost"];
  countPosts: HasManyCountAssociationsMixin = this["countPosts"];
  getPosts: HasManyGetAssociationsMixin<Post> = this["getPosts"];
  hasPost: HasManyHasAssociationMixin<Post, number> = this["hasPost"];

  addUpload: HasManyAddAssociationMixin<Upload, number> = this["addUpload"];
  countUploads: HasManyCountAssociationsMixin = this["countUploads"];
  createUpload: HasManyCreateAssociationMixin<Upload> = this["createUpload"];
  setUpload: HasOneSetAssociationMixin<Upload, number> = this["setUpload"];
  getUploads: HasManyGetAssociationsMixin<Upload> = this["getUpload"];

  countTags: HasManyCountAssociationsMixin = this["countTags"];
  createTag: HasManyCreateAssociationMixin<Tag> = this["createTag"];
  getTags: HasManyGetAssociationsMixin<Tag> = this["getTags"];
  hasTag: HasManyHasAssociationMixin<Tag, number> = this["hasTag"];

  setRole: HasOneSetAssociationMixin<Role, number> = this["setRole"];
  getRole: HasOneGetAssociationMixin<Role> = this["getRole"];

  createSetting: HasManyCreateAssociationMixin<Setting> = this["createSetting"];
  getSetting: HasOneGetAssociationMixin<Setting> = this["getSetting"];
  setSetting: HasOneSetAssociationMixin<Setting, number> = this["setSetting"];

  getSubscribers: HasManyGetAssociationsMixin<Subscribers> =
    this["getSubscribers"];
  hasSubscriber: HasManyHasAssociationMixin<Subscribers, number> =
    this["hasSubscriber"];
  addSubscriber: HasOneSetAssociationMixin<Subscribers, number> =
    this["addSubscriber"];
  createSubscriber: HasManyCreateAssociationMixin<Subscribers> =
    this["createSubscriber"];
  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly posts?: Post[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    posts: Association<Author, Post>;
  };
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
