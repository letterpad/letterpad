import { Image, Navigation } from "@/__generated__/__types__";
import { Table, Column, DataType } from "sequelize-typescript";
import Fix from "../decorators/Fix";

import { BaseModel } from "./base";

@Table({
  timestamps: true,
  tableName: "settings",
})
@Fix
export class Setting extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  public site_title!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public site_tagline!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public site_description!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  public site_email!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public site_url!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public site_footer!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public subscribe_embed!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public social_twitter!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public social_facebook!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public social_instagram!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public social_github!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: true })
  public displayAuthorInfo!: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  public cloudinary_key!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public cloudinary_name!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public cloudinary_secret!: string;

  @Column({ type: DataType.JSON, allowNull: false })
  public menu!: Navigation[];

  @Column({ type: DataType.STRING, allowNull: true })
  public css!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public google_analytics!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  public theme!: string;

  @Column({ type: DataType.JSON, allowNull: true })
  public banner!: Image;

  @Column({ type: DataType.JSON, allowNull: true })
  public site_logo!: Image;

  @Column({ type: DataType.JSON, allowNull: true })
  public site_favicon!: Image;

  @Column({ type: DataType.STRING, allowNull: false })
  public client_token!: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
  public intro_dismissed!: boolean;

  /* Associantions */

  // @BelongsTo(() => Author, "id")
  // public author!: Author;

  /* End Associantions */
}
