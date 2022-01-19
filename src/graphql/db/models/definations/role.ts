import { Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Fix from "../decorators/Fix";

import { BaseModel } from "./base";
import { Permission } from "./permission";
import { RolePermission } from "./rolePermission";

@Table({
  timestamps: true,
  tableName: "roles",
})
@Fix
export class Role extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  /* Associantions */
  @BelongsToMany(() => Permission, {
    through: () => RolePermission,
    foreignKey: "role_id",
  })
  public permissions!: Permission[];

  /* End Associantions */
}
