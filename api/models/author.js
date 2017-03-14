import {conn} from "../../config/mysql.config";
import Sequalize from "sequelize";

export const AuthorModel =  conn.define(
    "authors",
    {
        username: {
            type: Sequalize.STRING
        },
        password: {
            type: Sequalize.STRING
        },
        email: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true
    }
);
