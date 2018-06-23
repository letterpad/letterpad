export default (conn, DataTypes) => {
    const Media = conn.define(
        "media",
        {
            url: {
                type: DataTypes.STRING
            },
            name: {
                type: DataTypes.STRING
            },
            description: {
                type: DataTypes.STRING
            }
        },
        {
            freezeTableName: true
        }
    );
    // Media.associate = models => {
    //    // Media.belongsToMany(models.Author);
    // };
    return Media;
};
