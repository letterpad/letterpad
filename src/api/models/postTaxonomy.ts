import { Model, DataTypes } from "sequelize";

class PostTaxonomy extends Model {
  static associate(models) {
    this.belongsTo(models.Post);
  }
  static init(sequelize) {
    super.init.call(
      this,
      {
        post_id: {
          type: DataTypes.INTEGER,
        },
        taxonomy_id: {
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        freezeTableName: true,
      },
    );
    return PostTaxonomy;
  }
}

export default PostTaxonomy;
