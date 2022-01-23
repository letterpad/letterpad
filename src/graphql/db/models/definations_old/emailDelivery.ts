import { DataTypes, Model, Optional } from "sequelize";
import { EmailTemplates } from "@/graphql/types";
import { getReadableDate } from "@/graphql/resolvers/helpers";

export interface EmailDeliveryAttributes {
  id: number;
  template_id: EmailTemplates | string;
  updatedAt?: Date;
  createdAt: Date;
  lastDeliveryAttempt: Date;
  subscriber_id: number;
  post_id: number;
  author_id: number;
  delivered: boolean;
}

export interface EmailDeliveryCreationAttributes
  extends Optional<EmailDeliveryAttributes, "id"> {}

export class EmailDelivery
  extends Model<EmailDeliveryAttributes, EmailDeliveryCreationAttributes>
  implements EmailDeliveryAttributes
{
  id: number = this["id"];

  readonly createdAt: Date = this["createdAt"];
  readonly updatedAt: Date = this["updatedAt"];
  readonly lastDeliveryAttempt!: Date;

  readonly subscriber_id: number = this["subscriber_id"];
  readonly post_id: number = this["post_id"];
  readonly author_id: number = this["author_id"];
  readonly template_id: EmailTemplates = this["template_id"];
  readonly delivered: boolean = this["delivered"];

  constructor(...args) {
    super(...args);
  }
}

export default function initEmailDelivery(sequelize) {
  EmailDelivery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      template_id: {
        type: DataTypes.STRING as any,
      },
      subscriber_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      delivered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.getDataValue("updatedAt") || new Date());
        },
      },
      lastDeliveryAttempt: {
        type: DataTypes.DATE,
        allowNull: true,
        get() {
          return getReadableDate(
            this.getDataValue("lastDeliveryAttempt") || new Date(),
          );
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.getDataValue("createdAt") || new Date());
        },
      },
    },
    {
      tableName: "emailDelivery",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return EmailDelivery;
}
