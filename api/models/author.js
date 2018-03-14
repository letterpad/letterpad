// import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

export default (conn, Datatypes) => {
    const Author = conn.define(
        "author",
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
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Email not valid"
                    }
                }
            },
            social: {
                type: Sequalize.STRING,
                defaultValue: "{}"
            },
            fname: {
                type: Sequalize.STRING,
                defaultValue: ""
            },
            lname: {
                type: Sequalize.STRING,
                defaultValue: ""
            },
            token: {
                type: Sequalize.STRING,
                defaultValue: ""
            },
            avatar: {
                type: Sequalize.STRING,
                defaultValue: ""
            }
        },
        {
            freezeTableName: true
        }
    );
    Author.associate = models => {
        // 1:n
        Author.hasMany(models.Post);
        //  1:1
        Author.belongsTo(models.Role);
        Author.hasMany(models.Media);
    };
    return Author;
};
export const getPermissions = async (models, role_id) => {
    const permissions = await models.Permission.findAll({
        attributes: ["name"],
        through: { attributes: [] },
        include: [
            {
                model: models.Role,
                attributes: [],
                as: models.Role.tableName,
                where: {
                    id: role_id
                }
            }
        ]
    });
    return permissions.map(per => per.name);
};
