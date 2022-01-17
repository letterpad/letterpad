import { ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base";
import { Permission } from "./permission";
import { Role } from "./role";

@Table({
  timestamps: true,
  tableName: "rolePermissions",
})
export class RolePermission extends BaseModel {
  @ForeignKey(() => Role)
  public role_id!: number;

  @ForeignKey(() => Permission)
  public permission_id!: number;
}
