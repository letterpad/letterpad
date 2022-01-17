import { ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base";
import { Post } from "./post";
import { Tag } from "./tag";

@Table({
  timestamps: true,
  tableName: "postTags",
})
export class PostTag extends BaseModel {
  @ForeignKey(() => Post)
  public tag_id!: number;

  @ForeignKey(() => Tag)
  public post_id!: number;
}
