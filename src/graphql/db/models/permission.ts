import { DataTypes, Model, Optional } from "sequelize";

export interface PermissionAttributes {
  id: number;
  name: string;
}

export interface PermissionCreationAttributes
  extends Optional<PermissionAttributes, "id"> {}

export class Permission
  extends Model<PermissionAttributes, PermissionCreationAttributes>
  implements PermissionAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  constructor(...args) {
    super(...args);
  }
}

export default function initPermission(sequelize) {
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "permissions",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return Permission;
}

export function associatePermission(): void {}
