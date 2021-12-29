import { getReadableDate } from "../../resolvers/helpers";
import { DataTypes, Model, Optional } from "sequelize";

import { Subscribers } from "./subscriber";

export interface SubscribersDeliveryAttributes {
  id: number;

  updatedAt?: Date;
  createdAt: Date;
  subscriber_id: number;
  post_id: number;
  delivered: boolean;
}

export interface SubscribersDeliveryCreationAttributes
  extends Optional<SubscribersDeliveryAttributes, "id"> {}

export class SubscribersDelivery
  extends Model<
    SubscribersDeliveryAttributes,
    SubscribersDeliveryCreationAttributes
  >
  implements SubscribersDeliveryAttributes
{
  public id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly subscriber_id!: number;
  public readonly post_id!: number;
  public readonly delivered!: boolean;

  constructor(...args) {
    super(...args);
  }
}

export default function initSubscribersDelivery(sequelize) {
  SubscribersDelivery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      subscriber_id: {
        type: DataTypes.INTEGER,
      },
      post_id: {
        type: DataTypes.INTEGER,
      },
      delivered: {
        type: DataTypes.BOOLEAN,
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return getReadableDate(this.getDataValue("updatedAt") || new Date());
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
      tableName: "SubscribersDelivery",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return SubscribersDelivery;
}

export function associateSubscribersDelivery() {
  SubscribersDelivery.belongsTo(Subscribers, {
    foreignKey: "subscriber_id",
  });
}
