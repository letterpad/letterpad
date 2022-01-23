import { DataTypes, Model, Optional } from "sequelize";
import { Author } from "./author";

export interface SubscribersAttributes {
  id: number;
  email: string;
  author_id: number;
  verified: boolean;
  verify_attempt_left: number;
}

export interface SubscribersCreationAttributes
  extends Optional<SubscribersAttributes, "id"> {}

export class Subscribers
  extends Model<SubscribersAttributes, SubscribersCreationAttributes>
  implements SubscribersAttributes
{
  id: number = this["id"];
  email: string = this["email"];
  author_id: number = this["author_id"];
  verified: boolean = this["verified"];
  verify_attempt_left: number = this["verify_attempt_left"];

  readonly createdAt: Date = this["createdAt"];
  readonly updatedAt: Date = this["updatedAt"];

  constructor(...args) {
    super(...args);
  }
}

export default function initSubscribers(sequelize) {
  Subscribers.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
      },
      author_id: {
        type: DataTypes.INTEGER,
      },
      verified: {
        type: DataTypes.BOOLEAN,
      },
      verify_attempt_left: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },
    },
    {
      tableName: "subscribers",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Subscribers;
}

export function associateSubscribers() {
  Subscribers.belongsTo(Author, {
    foreignKey: "author_id",
  });
}
