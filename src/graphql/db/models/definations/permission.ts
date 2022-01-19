import { Table, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Fix from "../decorators/Fix";
import { BaseModel } from "./base";
import { Role } from "./role";
import { RolePermission } from "./rolePermission";

@Table({
  timestamps: true,
  tableName: "permissions",
})
@Fix
export class Permission extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false })
  public name!: string;

  //role
  @BelongsToMany(() => Role, {
    through: () => RolePermission,
  })
  public roles!: Role[];
  //end role
}
