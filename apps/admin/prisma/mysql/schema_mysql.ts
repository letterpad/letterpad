import { int, mysqlTable, text } from "drizzle-orm/mysql-core";

export const author = mysqlTable("author", {
  id: int("id").notNull().primaryKey(),
  name: text("name"),
  username: text("username"),
  email: text("email"),
  password: text("password"),
  bio: text("bio"),
  occupation: text("occupation"),
  company_name: text("company_name"),
  avatar: text("avatar"),
  social: text("social"),
  verified: int("verified").default(0),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
  verify_attempt_left: int("verify_attempt_left").default(3),
  analytics_id: int("analytics_id"),
  analytics_uuid: text("analytics_uuid"),
  role_id: int("role_id").notNull(),
  login_type: text("login_type").default("credentials"),
  last_seen: int("created_at", { mode: "timestamp" }),
  register_step: text("register_step"),
  role: text("role_id)").references(() => role.id),
  domain: text("domain_undefined"),
  posts: text("post[]_undefined"),
  setting: text("setting_undefined"),
  subscribers: text("subscriber[]_undefined"),
  uploads: text("upload[]_undefined"),
  first_post_published: int("first_post_published").default(0),
  settings_updated: int("settings_updated").default(0),
  profile_updated: int("profile_updated").default(0),
  stripe_customer_id: text("stripe_customer_id"),
  stripe_subscription_id: text("stripe_subscription_id"),
});
export const emaildelivery = mysqlTable("emaildelivery", {
  id: int("id").notNull().primaryKey(),
  template_id: text("template_id"),
  author_id: int("author_id"),
  post_id: int("post_id"),
  subscriber_id: int("subscriber_id"),
  delivered: int("delivered"),
  last_delivery_attempt: int("created_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
});
export const email = mysqlTable("email", {
  template_id: text("template_id"),
  subject: text("subject"),
  body: text("body"),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
});
export const permission = mysqlTable("permission", {
  id: int("id").notNull().primaryKey(),
  name: text("name"),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
  roles: text("rolepermissions[]_undefined"),
});
export const post = mysqlTable("post", {
  id: int("id").notNull().primaryKey(),
  title: text("title").default(""),
  sub_title: text("sub_title").default(""),
  html: text("html"),
  html_draft: text("html_draft"),
  excerpt: text("excerpt").default(""),
  cover_image: text("cover_image"),
  cover_image_width: int("cover_image_width").notNull().default(0),
  cover_image_height: int("cover_image_height").notNull().default(0),
  type: text("type").default("post"),
  featured: int("featured").default(0),
  status: text("status").default("draft"),
  slug: text("slug").default(""),
  reading_time: text("reading_time").default(""),
  publishedAt: int("created_at", { mode: "timestamp" }),
  scheduledAt: int("created_at", { mode: "timestamp" }),
  updatedAt: int("created_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  author_id: int("author_id").notNull(),
  author: text("author_id").references(() => author.id),
  tags: text("tag[]_undefined"),
  page_type: text("page_type").default("default"),
  page_data: text("page_data"),
  stats: text("stats").default("{}"),
});
export const rolepermissions = mysqlTable("rolepermissions", {
  id: int("id").notNull().primaryKey(),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
  role_id: int("role_id").notNull(),
  permission_id: int("permission_id").notNull(),
  permission: text("permission_id").references(() => permission.id),
  role: text("role_id").references(() => role.id),
});
export const role = mysqlTable("role", {
  id: int("id").notNull().primaryKey(),
  name: text("name"),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
  author: text("author[]_undefined"),
  permissions: text("rolepermissions[]_undefined"),
});
export const setting = mysqlTable("setting", {
  id: int("id").notNull().primaryKey(),
  site_title: text("site_title"),
  site_tagline: text("site_tagline"),
  site_email: text("site_email"),
  site_url: text("site_url"),
  site_footer: text("site_footer"),
  site_description: text("site_description"),
  subscribe_embed: text("subscribe_embed"),
  display_author_info: int("display_author_info").default(0),
  cloudinary_key: text("cloudinary_key"),
  cloudinary_name: text("cloudinary_name"),
  cloudinary_secret: text("cloudinary_secret"),
  menu: text("menu"),
  css: text("css"),
  theme: text("theme"),
  client_token: text("client_token"),
  banner: text("banner"),
  site_logo: text("site_logo"),
  site_favicon: text("site_favicon"),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
  graphcomment_id: text("graphcomment_id").default(""),
  intro_dismissed: int("intro_dismissed"),
  show_about_page: int("show_about_page").default(1),
  show_tags_page: int("show_tags_page").default(0),
  design: text("design"),
  scripts: text("scripts"),
  author_id: int("author_id").notNull(),
  author: text("author_id").references(() => author.id),
});

export const subscriber = mysqlTable("subscriber", {
  id: int("id").notNull().primaryKey(),
  email: text("email"),
  author_id: int("author_id").notNull(),
  verified: int("verified").default(0),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
  verify_attempt_left: int("verify_attempt_left").default(3),
  author: text("author_id").references(() => author.id),
});

export const tag = mysqlTable("tag", {
  name: text("name"),
  desc: text("desc").default(""),
  slug: text("slug"),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
  posts: text("post[]_undefined"),
});

export const upload = mysqlTable("upload", {
  id: int("id").notNull().primaryKey(),
  name: text("name"),
  url: text("url"),
  width: int("width").notNull(),
  height: int("height").notNull(),
  description: text("description").default(""),
  updatedAt: int("created_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  author_id: int("author_id").notNull(),
  author: text("author_id").references(() => author.id),
});

export const domain = mysqlTable("domain", {
  id: int("id").notNull().primaryKey(),
  name: text("name"),
  mapped: int("mapped").default(0),
  ssl: int("ssl"),
  updatedAt: int("created_at", { mode: "timestamp" }),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  author_id: int("author_id").notNull(),
  author: text("author_id").references(() => author.id),
});

export const subscribersdelivery = mysqlTable("subscribersdelivery", {
  id: int("id").notNull().primaryKey(),
  subscriber_id: text("subscriber_id"),
  post_id: int("post_id").notNull(),
  delivered: int("delivered"),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`
  ),
  updatedAt: int("created_at", { mode: "timestamp" }),
});
