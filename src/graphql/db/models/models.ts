import dbConfig from "../../../../config/db.config";
import Author, { associateAuthor } from "./definations_old/author";
import Upload, { associateUpload } from "./definations_old/uploads";
import Permission, { associatePermission } from "./definations_old/permission";
import EmailDelivery from "./definations_old/emailDelivery";
import Post, { associatePost } from "./definations_old/post";
import Role, { associateRole } from "./definations_old/role";
import { Options, Sequelize } from "sequelize";
import Setting from "./definations_old/setting";
import Tag, { associateTags } from "./definations_old/tag";
import Subscribers, {
  associateSubscribers,
} from "./definations_old/subscriber";
import SubscribersDelivery, {
  associateSubscribersDelivery,
} from "./definations_old/subscribersDelivery";
import Email, { associateEmail } from "./definations_old/email";

enum envs {
  development = "development",
  test = "test",
  production = "production",
}

let env: envs = process.env.NODE_ENV
  ? envs[process.env.NODE_ENV as envs]
  : envs.development;

if (env === envs.development) env = envs.development;
if (env === envs.test) env = envs.test;

const config = dbConfig[env] as Options;
// establish  database connection
export const conn = new Sequelize(config);

export const models = {
  Tags: Tag(conn),
  Setting: Setting(conn),
  Upload: Upload(conn),
  Email: Email(conn),
  Post: Post(conn),
  Author: Author(conn),
  Role: Role(conn),
  Permission: Permission(conn),
  Subscribers: Subscribers(conn),
  SubscribersDelivery: SubscribersDelivery(conn),
  EmailDelivery: EmailDelivery(conn),
};

associateTags();
associatePost();
associateAuthor();
associateRole();
associatePermission();
associateUpload();
associateSubscribers();
associateSubscribersDelivery();
associateEmail();

// const models = { Sequelize: Sequelize, sequelize: conn, ...modelsMap };
export type ModelsType = typeof models;
export default conn;
