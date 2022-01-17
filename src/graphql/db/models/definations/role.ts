import {
  Table,
  Column,
  DataType,
  BelongsToMany,
  AutoIncrement,
  PrimaryKey,
} from "sequelize-typescript";

import { BaseModel } from "./base";
import { Permission } from "./permission";
import { RolePermission } from "./rolePermission";

@Table({
  timestamps: true,
  tableName: "roles",
})
export class Role extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  public id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  /* Associantions */
  // @HasMany(() => Author)
  // public authors!: Author[];

  @BelongsToMany(() => Permission, {
    through: () => RolePermission,
    foreignKey: "role_id",
  })
  public permissions!: Permission[];

  /* End Associantions */
}
