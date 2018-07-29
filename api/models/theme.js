export default (conn, DataTypes) => {
    const Theme = conn.define(
        "theme",
        {
            name: {
                type: DataTypes.STRING
            },
            value: {
                type: DataTypes.STRING
            },
            settings: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false,
            freezeTableName: true // Model tableName will be the same as the model name
        }
    );

    return Theme;
};
