// const Seq = require("sequelize");

// const seq = new Seq("", "", "", {
//   dialect: "sqlite",
//   storage: "./data/letterpad.sqlite",
//   define: {
//     underscored: true,
//   },
// });

// class Post extends Seq.Model {
//   constructor(...args) {
//     super(...args);
//   }
// }

// async function initPost() {
//   Post.init(
//     {
//       cover_image: {
//         type: Seq.DataTypes.STRING,
//         defaultValue: "",
//         get() {
//           return this.getDataValue("cover_image");
//         },
//       },
//     },
//     {
//       tableName: "posts",
//       sequelize: seq,
//     },
//   );

//   // await seq.sync({ force: true });

//   await Post.create({
//     cover_image: "this is a test",
//   });
// }

// initPost().then(async () => {
//   const res = await Post.findOne({
//     where: {
//       id: "1",
//     },
//   });
//   console.log("outside", res.cover_image);
// });

// // for (let key in post) {
// //   console.log(key);
// // }
const fs = require("fs");
function getRandomDate() {
  const start = new Date(2021, 0, 1);
  const end = new Date();

  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );

  const randomDateParts = randomDate.toISOString().split("T");

  return randomDateParts[0] + " " + randomDateParts[1];
}

const pages = [
  "posts",
  "edit-post",
  "tags",
  "settings",
  "edit-page",
  "pages",
  "tags",
];

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const n = 500;
const data = [];
let str = "";
for (let i = 0; i < n; i++) {
  const page = pages[Math.floor(Math.random() * pages.length)];
  const visitedAt = getRandomDate();
  const age = randomIntFromInterval(22, 45);
  const nextPage = pages[Math.floor(Math.random() * pages.length)];
  const lengthOfStay = randomIntFromInterval(1, 10);

  data.push({ page, visitedAt, age, nextPage, lengthOfStay });
  let a = `${page}`;
  str += `${page}, ${visitedAt}, ${age}, ${nextPage}, ${lengthOfStay} \n`;
}

fs.writeFileSync("data.csv", str);
