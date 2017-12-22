import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";
import { RolePermissionModel } from "./rolePermission";
import { PermissionModel } from "./permission";

export const AuthorModel = conn.define(
    "authors",
    {
        username: {
            type: Sequalize.STRING,
            defaultValue: ""
        },
        password: {
            type: Sequalize.STRING,
            allowNull: false
        },
        email: {
            type: Sequalize.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Email not valid"
                }
            }
        },
        social: {
            type: Sequalize.TEXT
        },
        fname: {
            type: Sequalize.STRING,
            defaultValue: ""
        },
        lname: {
            type: Sequalize.STRING,
            defaultValue: ""
        }
    },
    {
        freezeTableName: true
    }
);

export const getPermissions = async role_id => {
    let rolePermArr = await RolePermissionModel.findAll({
        attributes: ["permission_id"],
        where: { role_id: role_id }
    });
    // get permission ids
    let ids = rolePermArr.map(item => item.permission_id);

    // get permission names
    let permObj = await PermissionModel.findAll({
        attributes: ["name"],
        where: { id: ids }
    });

    return permObj.map(per => per.name);
};
