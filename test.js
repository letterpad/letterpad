const Seq = require("sequelize");

const seq = new Seq("", "", "", {
  dialect: "sqlite",
  storage: "./data/letterpad.sqlite",
  define: {
    underscored: true,
  },
});

class Post extends Seq.Model {
  constructor(...args) {
    super(...args);
  }
}

async function initPost() {
  Post.init(
    {
      cover_image: {
        type: Seq.DataTypes.STRING,
        defaultValue: "",
        get() {
          return this.getDataValue("cover_image");
        },
      },
    },
    {
      tableName: "posts",
      sequelize: seq,
    },
  );

  // await seq.sync({ force: true });

  await Post.create({
    cover_image: "this is a test",
  });
}

initPost().then(async () => {
  const res = await Post.findOne({
    where: {
      id: "1",
    },
  });
  console.log("outside", res.cover_image);
});

// for (let key in post) {
//   console.log(key);
// }
