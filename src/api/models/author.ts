import { DataTypes, Model } from "sequelize";

class Author extends Model {
  static associate(models) {
    this.hasMany(models.Post);
    //  1:1
    this.belongsTo(models.Role);
    this.hasMany(models.Media);
  }
  static init(sequelize) {
    super.init.call(
      this,
      {
        username: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: {
              msg: "Email not valid",
            },
          },
        },
        social: {
          type: DataTypes.STRING,
          defaultValue: "{}",
        },
        fname: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        lname: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        bio: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        token: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
        avatar: {
          type: DataTypes.STRING,
          defaultValue: "",
        },
      },
      {
        sequelize,
        freezeTableName: true,
      },
    );
    return Author;
  }
}

export default Author;

export const getPermissions = async (models, roleId) => {
  const permissions = await models.Permission.findAll({
    attributes: ["name"],
    through: { attributes: [] },
    include: [
      {
        model: models.Role,
        attributes: [],
        as: models.Role.tableName,
        where: {
          id: roleId,
        },
      },
    ],
  });
  return permissions.map(per => per.name);
};
