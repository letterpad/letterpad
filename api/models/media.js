import Sequalize from "sequelize";

export default (conn, DataTypes) => {
    const Media = conn.define(
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
    Media.associate = models => {
        Media.hasOne(models.Post);
    };
};
