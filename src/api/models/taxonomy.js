export default (conn, DataTypes) => {
  const Taxonomy = conn.define(
    "taxonomy",
    {
      name: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.STRING,
      },
      slug: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true, // Model tableName will be the same as the model name
    },
  );

  Taxonomy.associate = models => {
    Taxonomy.belongsToMany(models.Post, {
      through: "PostTaxonomy",
    });
  };
  return Taxonomy;
};
