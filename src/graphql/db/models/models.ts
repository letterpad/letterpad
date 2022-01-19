import { connection } from "./connection";
import { Author } from "./definations/author";
import { Email } from "./definations/email";
import { EmailDelivery } from "./definations/emailDelivery";
import { Upload } from "./definations/uploads";
import { Permission } from "./definations/permission";
import { Post } from "./definations/post";
import { PostTag } from "./definations/postTag";
import { Role } from "./definations/role";
import { RolePermission } from "./definations/rolePermission";
import { Setting } from "./definations/setting";
import { Subscribers } from "./definations/subscriber";
import { Tag } from "./definations/tag";

connection.addModels([
  Post,
  Author,
  Subscribers,
  PostTag,
  Tag,
  Role,
  Permission,
  RolePermission,
  Email,
  Upload,
  EmailDelivery,
  Setting,
]);

export const models = {
  Post,
  Author,
  Subscribers,
  PostTag,
  Tag,
  Role,
  Permission,
  RolePermission,
  Email,
  Upload,
  EmailDelivery,
  Setting,
};
export type ModelsType = typeof models;

export default connection;
