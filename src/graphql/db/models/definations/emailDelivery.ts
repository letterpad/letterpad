import { Table, Column, DataType } from "sequelize-typescript";
import { BaseModel } from "./base";
import { EmailTemplates } from "@/graphql/types";
import Fix from "../decorators/Fix";

@Table({
  timestamps: true,
  tableName: "emailDelivery",
})
@Fix
export class EmailDelivery extends BaseModel {
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

const getReadableDate = (timestamp: Date) => {
  return new Date(timestamp).toLocaleString("en-us", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });
};
