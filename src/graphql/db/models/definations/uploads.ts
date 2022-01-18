import { Table, Column, DataType, BelongsTo } from "sequelize-typescript";
import Fix from "../decorators/Fix";
import { Author } from "./author";

import { BaseModel } from "./base";

@Table({
  timestamps: true,
  tableName: "uploads",
})
@Fix
export class Upload extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  public url!: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  public name!: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public width!: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public height!: number;

  @Column({ type: DataType.STRING, allowNull: true })
  public description!: string;

  /* Associations */

  @BelongsTo(() => Author, "author_id")
  public author!: Author;

  /* End Associantions */
}
