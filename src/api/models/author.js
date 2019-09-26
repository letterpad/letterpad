export default (conn, Datatypes) => {
  const Author = conn.define(
    "author",
    {
      username: {
        type: Datatypes.STRING,
        defaultValue: "",
      },
      password: {
        type: Datatypes.STRING,
        allowNull: false,
      },
      email: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Email not valid",
          },
        },
      },
      social: {
        type: Datatypes.STRING,
        defaultValue: "{}",
      },
      fname: {
        type: Datatypes.STRING,
        defaultValue: "",
      },
      lname: {
        type: Datatypes.STRING,
        defaultValue: "",
      },
      bio: {
        type: Datatypes.STRING,
        defaultValue: "",
      },
      token: {
        type: Datatypes.STRING,
        defaultValue: "",
      },
      avatar: {
        type: Datatypes.STRING,
        defaultValue: "",
      },
    },
    {
      freezeTableName: true,
    },
  );
  Author.associate = models => {
    // 1:n
    Author.hasMany(models.Post);
    //  1:1
    Author.belongsTo(models.Role);
    Author.hasMany(models.Media);
  };
  return Author;
};
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
