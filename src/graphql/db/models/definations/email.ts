import { EmailTemplates } from "@/graphql/types";
import { Table, Column, DataType } from "sequelize-typescript";
import Fix from "../decorators/Fix";
import { BaseModel } from "./base";

@Table({
  timestamps: true,
  tableName: "emails",
})
@Fix
export class Email extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  public template_id!: EmailTemplates;

  @Column({ type: DataType.TEXT, allowNull: false })
  public body!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public subject!: string;
}
