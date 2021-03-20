import { Post } from "./post";
import { DataTypes, Model, Optional } from "sequelize";

export interface PostTaxonomyAttributes {
  id: number;
  post_id: number;
  taxonomy_id: number;
}

export interface PostTaxonomyCreationAttributes
  extends Optional<PostTaxonomyAttributes, "id"> {}

export class PostTaxonomy
  extends Model<PostTaxonomyAttributes, PostTaxonomyCreationAttributes>
  implements PostTaxonomyAttributes {
  public id!: number;
  public post_id!: number;
  public taxonomy_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public addTaxonomy!: HasManyAddAssociationMixin<Post, number>;
}

export default function initPostTaxonomy(sequelize) {
  PostTaxonomy.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      post_id: {
        type: DataTypes.NUMBER,
      },
      taxonomy_id: {
        type: DataTypes.NUMBER,
      },
    },
    {
      tableName: "postTaxonomies",
      sequelize, // passing the `sequelize` instance is required
    },
  );

  return PostTaxonomy;
}

export function associatePostTaxonomy(): void {
  PostTaxonomy.belongsTo(Post);
}
// import { Model, DataTypes } from "sequelize";

// class PostTaxonomy extends Model {
//   static associate(models) {
//     this.belongsTo(models.Post);
//   }
//   static init(sequelize) {
//     super.init.call(
//       this,
//       {
//         post_id: {
//           type: DataTypes.INTEGER,
//         },
//         taxonomy_id: {
//           type: DataTypes.INTEGER,
//         },
//       },
//       {
//         sequelize,
//         freezeTableName: true,
//       },
//     );
//     return PostTaxonomy;
//   }
// }

// export default PostTaxonomy;
