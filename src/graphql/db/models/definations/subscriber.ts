import { Table, Column, DataType, BelongsTo } from "sequelize-typescript";
import Fix from "../decorators/Fix";
import { Author } from "./author";

import { BaseModel } from "./base";

@Table({
  timestamps: true,
  tableName: "subscribers",
})
@Fix
export class Subscribers extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  public email!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  public author_id!: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  public verified!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 3 })
  public verify_attempt_left!: number;

  /* Associantions */
  @BelongsTo(() => Author, "author_id")
  public author!: Author;
  /* End Associantions */
}
