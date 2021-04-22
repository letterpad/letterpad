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
} from "sequelize";
import restoreSequelizeAttributesOnClass from "./_tooling";

import { Media } from "./media";
import {
  Social,
  Role as QraphqlRole,
  Permissions as GraqhqlPermissions,
} from "../../../../__generated__/src/graphql/type-defs.graphqls";

// These are all the attributes in the User model
interface AuthorAttributes {
  id: number;
  name: string;
  email: string;
  bio: string;
  password: string;
  avatar: string;
  social: Social;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthorCreationAttributes extends Optional<AuthorAttributes, "id"> {}

export class Author
  extends Model<AuthorAttributes, AuthorCreationAttributes>
  implements AuthorAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public bio!: string;
  public password!: string;
  public avatar!: string;
  public social!: Social;
  public role!: QraphqlRole;
  public permissions!: GraqhqlPermissions[];

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getPosts!: HasManyGetAssociationsMixin<Post>; // Note the null assertions!
  public addPost!: HasManyAddAssociationMixin<Post, number>;
  public addMedia!: HasManyAddAssociationMixin<Media, number>;
  public hasPost!: HasManyHasAssociationMixin<Post, number>;
  public countPosts!: HasManyCountAssociationsMixin;
  public createPost!: HasManyCreateAssociationMixin<Post>;
  public setRole!: HasManyHasAssociationMixin<Role, number>;
  public getRole!: HasOneGetAssociationMixin<Role>;

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
      "createPost",
      "setRole",
      "getRole",
      "addMedia",
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

  Author.hasMany(Media, { sourceKey: "id", foreignKey: "author_id" });
}
