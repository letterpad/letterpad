import {
  Role as GraphqlRole,
  Permissions as GraphqlPermissions,
  Social,
} from "@/__generated__/__types__";
import {
  Table,
  Column,
  DataType,
  HasMany,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
} from "sequelize-typescript";

import { BaseModel } from "./base";
import { Upload } from "./uploads";
import { Post } from "./post";
import { Role } from "./role";
import { Setting } from "./setting";
import { Subscribers } from "./subscriber";
import { Tag } from "./tag";
import Fix from "../decorators/Fix";

@Table({
  timestamps: true,
  tableName: "authors",
})
@Fix
export class Author extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public username!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public password!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public bio!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public avatar!: string;

  @Column({ type: DataType.JSON, allowNull: true })
  public social!: Social;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  public verified!: boolean;

  @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 3 })
  public verify_attempt_left!: number;

  /* Associantions */
  @HasMany(() => Subscribers, "author_id")
  public subscribers!: Subscribers[];
  // end post

  //posts
  @HasMany(() => Post, "author_id")
  public posts!: Post[];
  //end posts

  //tags
  @HasMany(() => Tag, "author_id")
  public tags!: Tag[];
  //end tags

  //media
  @HasMany(() => Upload, "author_id")
  public uploads!: Upload[];
  //end media

  //setting
  @BelongsTo(() => Setting, "setting_id")
  public setting!: Setting;
  //end setting

  //role
  @BelongsTo(() => Role, "role_id")
  public role!: GraphqlRole;
  //end role

  public permissions!: GraphqlPermissions[];

  /* End Associantions */
}
