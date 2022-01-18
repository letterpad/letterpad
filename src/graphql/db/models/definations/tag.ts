import { Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Fix from "../decorators/Fix";

import { BaseModel } from "./base";
import { Post } from "./post";
import { PostTag } from "./postTag";

@Table({
  timestamps: true,
  tableName: "tags",
})
@Fix
export class Tag extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public desc!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  get slug() {
    return "/tag/" + this.getDataValue("slug");
  }

  /* Associantions */
  @BelongsToMany(() => Post, {
    through: () => PostTag,
  })
  public posts!: Post[];
  /* End Associantions */
  // @BelongsTo(() => Author, "author_id")
  // public getAuthor!: Author;
}
