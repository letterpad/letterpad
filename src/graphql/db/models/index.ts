// import Author, { associateAuthor } from "./author";
// import Media, { associateMedia } from "./media";
// import Permission, { associatePermission } from "./permission";
// import EmailDelivery from "./emailDelivery";
// import Post, { associatePost } from "./post";
// import Role, { associateRole } from "./role";
// import { Sequelize } from "sequelize";
// import Setting from "./setting";
// import Tags, { associateTags } from "./tags";
// import dbConfig from "../../../../config/db.config";
// import Subscribers, { associateSubscribers } from "./subscriber";
// import SubscribersDelivery, {
//   associateSubscribersDelivery,
// } from "./subscribersDelivery";
// import Email, { associateEmail } from "./email";

// enum envs {
//   development = "development",
//   test = "test",
//   production = "production",
// }

// let env: envs = process.env.NODE_ENV
//   ? envs[process.env.NODE_ENV as envs]
//   : envs.development;

// if (env === envs.development) env = envs.development;
// if (env === envs.test) env = envs.test;

// const config = dbConfig[env];
// // establish  database connection
// export const conn = new Sequelize(
//   config.database as string,
//   config.username as string,
//   config.password as string,
//   {
//     ...config,
//     dialect: config.dialect || "sqlite",
//   },
// );

// export const modelsMap = {
//   Tags: Tags(conn),
//   Setting: Setting(conn),
//   Media: Media(conn),
//   Email: Email(conn),
//   Post: Post(conn),
//   Author: Author(conn),
//   Role: Role(conn),
//   Permission: Permission(conn),
//   Subscribers: Subscribers(conn),
//   SubscribersDelivery: SubscribersDelivery(conn),
//   EmailDelivery: EmailDelivery(conn),
// };

// associateTags();
// associatePost();
// associateAuthor();
// associateRole();
// associatePermission();
// associateMedia();
// associateSubscribers();
// associateSubscribersDelivery();
// associateEmail();

// const models = { Sequelize: Sequelize, sequelize: conn, ...modelsMap };

// export default models;

export { models } from "./index2";
