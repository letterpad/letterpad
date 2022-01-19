import { Image, PostStatusOptions, PostTypes } from "@/__generated__/__types__";
import {
  Table,
  Column,
  DataType,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import Fix from "../decorators/Fix";
import { Author } from "./author";

import { BaseModel } from "./base";
import { PostTag } from "./postTag";
import { Tag } from "./tag";

@Table({
  timestamps: true,
  tableName: "posts",
})
@Fix
export class Post extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: true })
  public title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    get() {
      return "/" + this.getDataValue("type") + "/" + this.getDataValue("slug");
    },
  })
  public slug!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public html!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  public html_draft!: string;

  @Column({ type: DataType.STRING(400), allowNull: true })
  public excerpt!: string;

  @Column({
    type: DataType.STRING(400),
    allowNull: true,
    get() {
      const cImage = this.getDataValue("cover_image");
      if (cImage && cImage.startsWith("/")) {
        this.setDataValue("cover_image", process.env.ROOT_URL + cImage);
      }
      return {
        src: cImage,
        width: this.getDataValue("cover_image_width"),
        height: this.getDataValue("cover_image_height"),
      };
    },
  })
  public cover_image!: Image;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public cover_image_width!: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  public cover_image_height!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public type!: PostTypes;

  @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: false })
  public featured!: boolean;

  @Column({ type: DataType.STRING, allowNull: false, defaultValue: "draft" })
  public status!: PostStatusOptions;

  @Column({ type: DataType.STRING, allowNull: true })
  public reading_time!: string;

  @Column({ type: DataType.DATE, allowNull: true })
  public publishedAt!: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  public scheduledAt!: Date;

  /* Associantions */
  // Author
  @BelongsTo(() => Author, "author_id")
  public author!: Author;
  // end Author

  // Tag
  @BelongsToMany(() => Tag, {
    through: () => PostTag,
  })
  public tags!: Tag[];

  /* End Associantions */
}
