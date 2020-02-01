import { Model, DataTypes } from "sequelize";

class Taxonomy extends Model {
  static associate(models) {
    this.belongsToMany(models.Post, {
      through: "PostTaxonomy",
    });
  }

  static init(sequelize) {
    super.init.call(
      this,
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
        sequelize,
        freezeTableName: true,
      },
    );
    return Taxonomy;
  }
}

export default Taxonomy;
