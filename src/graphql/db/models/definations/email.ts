import { Table, Column, DataType, PrimaryKey } from "sequelize-typescript";
import { BaseModel } from "./base";

@Table({
  timestamps: true,
  tableName: "emails",
})
export class Email extends BaseModel {
  @PrimaryKey
  @Column({ type: DataType.STRING, allowNull: false })
  public template_id!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  public body!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public subject!: string;
}
