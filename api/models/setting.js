export default (conn, DataTypes) => {
  const Setting = conn.define(
    "setting",
    {
      option: {
        type: DataTypes.STRING,
      },
      value: {
        type: DataTypes.TEXT,
      },
    },
    {
      freezeTableName: true, // Model tableName will be the same as the model name
    },
  );
  return Setting;
};
