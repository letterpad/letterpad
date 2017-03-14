import {conn} from "../../config/mysql.config";
import Sequalize from "sequelize";

export const TaxonomyModel = conn.define(
    "taxonomies",
    {
        name: {
            type: Sequalize.STRING
        },
        type: {
            type: Sequalize.STRING
        }
    },
    {
        freezeTableName: true // Model tableName will be the same as the model name
    }
);
