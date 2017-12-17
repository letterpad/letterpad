import { conn } from "../../config/mysql.config";
import Sequalize from "sequelize";

export const MediaModel = conn.define(
    "media",
    {
        url: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true
    }
);
