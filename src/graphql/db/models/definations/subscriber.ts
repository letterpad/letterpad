import {
  Table,
  Column,
  DataType,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";
import { Author } from "./author";

import { BaseModel } from "./base";

@Table({
  timestamps: true,
  tableName: "subscribers",
})
export class Subscribers extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public email!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public author_id!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  public verified!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 3 })
  public verify_attempt_left!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  public createdAt!: string;
  /* Associantions */
  @BelongsTo(() => Author, "author_id")
  public author!: Author;
  /* End Associantions */
}
