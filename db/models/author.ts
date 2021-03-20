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
} from "sequelize";

// These are all the attributes in the User model
interface AuthorAttributes {
  id: number;
  name: string;
  email: string;
  bio: string;
  password: string;
  avatar: string;
  social: JSON;
  createdAt?: Date;
  updatedAt?: Date;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface AuthorCreationAttributes extends Optional<AuthorAttributes, "id"> {}

export class Author
  extends Model<AuthorAttributes, AuthorCreationAttributes>
  implements AuthorAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  public email!: string;
  public bio!: string;
  public password!: string;
  public avatar!: string;
  public social!: JSON;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getPosts!: HasManyGetAssociationsMixin<Post>; // Note the null assertions!
  public addPost!: HasManyAddAssociationMixin<Post, number>;
  public hasPost!: HasManyHasAssociationMixin<Post, number>;
  public countPosts!: HasManyCountAssociationsMixin;
  public createPost!: HasManyCreateAssociationMixin<Post>;

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
        type: DataTypes.INTEGER.UNSIGNED,
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
  });

  Author.hasOne(Role);
}
