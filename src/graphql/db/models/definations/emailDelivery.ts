import { getReadableDate } from "../../../resolvers/helpers";
import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import { BaseModel } from "./base";
import { EmailTemplates } from "@/graphql/types";

@Table({
  timestamps: true,
  tableName: "emailDelivery",
})
export class EmailDelivery extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public template_id!: EmailTemplates;

  @Column({ type: DataType.DATE, allowNull: true })
  get lastDeliveryAttempt(): string {
    return getReadableDate(
      this.getDataValue("lastDeliveryAttempt") || new Date(),
    );
  }

  @Column({ type: DataType.INTEGER, allowNull: true })
  public subscriber_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public post_id!: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public author_id!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  public delivered!: boolean;
}
