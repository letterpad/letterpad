import { relations, sql } from "drizzle-orm";
import {
  AnyMySqlColumn,
  datetime,
  index,
  int,
  mysqlSchema,
  mysqlTable,
  primaryKey,
  text,
  tinyint,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const Author = mysqlTable(
  "Author",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    password: varchar("password", { length: 191 }).notNull(),
    bio: text("bio").notNull(),
    occupation: varchar("occupation", { length: 100 }).notNull(),
    company_name: varchar("company_name", { length: 100 }).notNull(),
    avatar: varchar("avatar", { length: 300 }).notNull(),
    social: varchar("social", { length: 500 }).default("{}").notNull(),
    verified: tinyint("verified").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    verify_attempt_left: int("verify_attempt_left").default(3),
    role_id: int("role_id").notNull(),
    last_seen: datetime("last_seen", { mode: "string", fsp: 3 }),
    login_type: varchar("login_type", { length: 191 })
      .default("credentials")
      .notNull(),
    analytics_id: int("analytics_id"),
    analytics_uuid: varchar("analytics_uuid", { length: 191 }),
    first_post_published: tinyint("first_post_published").default(0).notNull(),
    profile_updated: tinyint("profile_updated").default(0).notNull(),
    settings_updated: tinyint("settings_updated").default(0).notNull(),
    stripe_customer_id: varchar("stripe_customer_id", { length: 191 }),
    stripe_subscription_id: varchar("stripe_subscription_id", { length: 191 }),
    register_step: varchar("register_step", { length: 50 }).default(""),
  },
  (table) => {
    return {
      role_id_idx: index("Author_role_id_idx").on(table.role_id),
      Author_id: primaryKey(table.id),
      Author_username_key: unique("Author_username_key").on(table.username),
      Author_email_key: unique("Author_email_key").on(table.email),
    };
  }
);

export const authorRelations = relations(Author, ({ many, one }) => ({
  posts: many(Post),
  setting: one(Setting),
}));

export const Domain = mysqlTable(
  "Domain",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    mapped: tinyint("mapped").default(0).notNull(),
    ssl: tinyint("ssl").notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    author_id: int("author_id").notNull(),
  },
  (table) => {
    return {
      Domain_id: primaryKey(table.id),
      Domain_author_id_key: unique("Domain_author_id_key").on(table.author_id),
    };
  }
);

export const Email = mysqlTable(
  "Email",
  {
    template_id: varchar("template_id", { length: 191 }).notNull(),
    subject: varchar("subject", { length: 191 }).notNull(),
    body: varchar("body", { length: 4000 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      Email_id: primaryKey(table.template_id),
      Email_template_id_key: unique("Email_template_id_key").on(
        table.template_id
      ),
    };
  }
);

export const EmailDelivery = mysqlTable(
  "EmailDelivery",
  {
    id: int("id").autoincrement().notNull(),
    template_id: varchar("template_id", { length: 191 }),
    author_id: int("author_id"),
    post_id: int("post_id"),
    subscriber_id: int("subscriber_id"),
    delivered: int("delivered"),
    last_delivery_attempt: datetime("last_delivery_attempt", {
      mode: "string",
      fsp: 3,
    }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      EmailDelivery_id: primaryKey(table.id),
    };
  }
);

export const Permission = mysqlTable(
  "Permission",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 191 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      Permission_id: primaryKey(table.id),
      Permission_name_key: unique("Permission_name_key").on(table.name),
    };
  }
);

export const Post = mysqlTable(
  "Post",
  {
    id: int("id").autoincrement().notNull(),
    title: varchar("title", { length: 191 }).default("").notNull(),
    html: text("html").notNull(),
    html_draft: text("html_draft"),
    excerpt: varchar("excerpt", { length: 191 }).default("").notNull(),
    cover_image: varchar("cover_image", { length: 255 }).default("").notNull(),
    cover_image_width: int("cover_image_width").default(0).notNull(),
    cover_image_height: int("cover_image_height").default(0).notNull(),
    type: varchar("type", { length: 191 }).default("post").notNull(),
    featured: tinyint("featured").default(0).notNull(),
    status: varchar("status", { length: 191 }).default("draft").notNull(),
    slug: varchar("slug", { length: 191 }).default("").notNull(),
    reading_time: varchar("reading_time", { length: 191 })
      .default("")
      .notNull(),
    publishedAt: datetime("publishedAt", { mode: "string", fsp: 3 }),
    scheduledAt: datetime("scheduledAt", { mode: "string", fsp: 3 }),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    author_id: int("author_id")
      .notNull()
      .references(() => Author.id, {
        onDelete: "cascade",
      }),
    page_data: text("page_data").notNull(),
    page_type: varchar("page_type", { length: 191 })
      .default("default")
      .notNull(),
    stats: varchar("stats", { length: 191 }).default("{}").notNull(),
    sub_title: varchar("sub_title", { length: 190 }).default("").notNull(),
  },
  (table) => {
    return {
      author_id_idx: index("Post_author_id_idx").on(table.author_id),
      idx_post_id: index("idx_post_id").on(table.id),
      idx_post_slug: index("idx_post_slug").on(table.slug),
      idx_post_createdAt: index("idx_post_createdAt").on(table.createdAt),
      Post_id: primaryKey(table.id),
    };
  }
);

export const postsRelations = relations(Post, ({ many, one }) => ({
  postTags: many(_PostToTag),
  author: one(Author, {
    fields: [Post.author_id],
    references: [Author.id],
  }),
}));

export const Role = mysqlTable(
  "Role",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 191 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      Role_id: primaryKey(table.id),
      Role_name_key: unique("Role_name_key").on(table.name),
    };
  }
);

export const RolePermissions = mysqlTable(
  "RolePermissions",
  {
    id: int("id").autoincrement().notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    role_id: int("role_id").notNull(),
    permission_id: int("permission_id").notNull(),
  },
  (table) => {
    return {
      permission_id_idx: index("RolePermissions_permission_id_idx").on(
        table.permission_id
      ),
      role_id_idx: index("RolePermissions_role_id_idx").on(table.role_id),
      RolePermissions_id: primaryKey(table.id),
    };
  }
);

export const Setting = mysqlTable(
  "Setting",
  {
    id: int("id").autoincrement().notNull(),
    site_title: varchar("site_title", { length: 191 }).notNull(),
    site_tagline: varchar("site_tagline", { length: 191 }).notNull(),
    site_email: varchar("site_email", { length: 191 }).notNull(),
    site_url: varchar("site_url", { length: 191 }).notNull(),
    site_footer: varchar("site_footer", { length: 191 }).notNull(),
    site_description: varchar("site_description", { length: 191 }).notNull(),
    subscribe_embed: varchar("subscribe_embed", { length: 191 }).notNull(),
    display_author_info: tinyint("display_author_info").default(0).notNull(),
    cloudinary_key: varchar("cloudinary_key", { length: 191 }).notNull(),
    cloudinary_name: varchar("cloudinary_name", { length: 191 }).notNull(),
    cloudinary_secret: varchar("cloudinary_secret", { length: 191 }).notNull(),
    menu: varchar("menu", { length: 500 }).default("[]").notNull(),
    css: varchar("css", { length: 500 }).notNull(),
    theme: varchar("theme", { length: 191 }).notNull(),
    client_token: varchar("client_token", { length: 191 }).notNull(),
    banner: varchar("banner", { length: 300 }).default("{}").notNull(),
    site_logo: varchar("site_logo", { length: 300 }).default("{}").notNull(),
    site_favicon: varchar("site_favicon", { length: 300 })
      .default("{}")
      .notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    graphcomment_id: varchar("graphcomment_id", { length: 191 })
      .default("")
      .notNull(),
    intro_dismissed: tinyint("intro_dismissed").notNull(),
    author_id: int("author_id").notNull(),
    show_about_page: tinyint("show_about_page").default(1).notNull(),
    show_tags_page: tinyint("show_tags_page").default(0).notNull(),
    scripts: text("scripts"),
    design: varchar("design", { length: 300 }).default("{}").notNull(),
  },
  (table) => {
    return {
      Setting_id: primaryKey(table.id),
      Setting_author_id_key: unique("Setting_author_id_key").on(
        table.author_id
      ),
    };
  }
);

export const settingRelations = relations(Setting, ({ one }) => ({
  author: one(Author, {
    fields: [Setting.author_id],
    references: [Author.id],
  }),
}));

export const Subscriber = mysqlTable(
  "Subscriber",
  {
    id: int("id").autoincrement().notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    author_id: int("author_id").notNull(),
    verified: tinyint("verified").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    verify_attempt_left: int("verify_attempt_left").default(3),
  },
  (table) => {
    return {
      author_id_idx: index("Subscriber_author_id_idx").on(table.author_id),
      Subscriber_id: primaryKey(table.id),
      Subscriber_email_author_id_key: unique(
        "Subscriber_email_author_id_key"
      ).on(table.email, table.author_id),
    };
  }
);

export const SubscribersDelivery = mysqlTable(
  "SubscribersDelivery",
  {
    id: int("id").autoincrement().notNull(),
    subscriber_id: varchar("subscriber_id", { length: 191 }),
    post_id: int("post_id").notNull(),
    delivered: tinyint("delivered").notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      SubscribersDelivery_id: primaryKey(table.id),
    };
  }
);

export const Tag = mysqlTable(
  "Tag",
  {
    name: varchar("name", { length: 191 }).notNull(),
    desc: varchar("desc", { length: 191 }).default(""),
    slug: varchar("slug", { length: 191 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      Tag_id: primaryKey(table.name),
      Tag_name_key: unique("Tag_name_key").on(table.name),
    };
  }
);

export const TagRelations = relations(Tag, ({ many }) => ({
  postTags: many(_PostToTag),
}));

export const Upload = mysqlTable(
  "Upload",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    url: varchar("url", { length: 191 }).notNull(),
    width: int("width").notNull(),
    height: int("height").notNull(),
    description: varchar("description", { length: 191 }).default("").notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    author_id: int("author_id").notNull(),
  },
  (table) => {
    return {
      author_id_idx: index("Upload_author_id_idx").on(table.author_id),
      Upload_id: primaryKey(table.id),
    };
  }
);
export const uploadRelations = relations(Upload, ({ many }) => ({
  author: many(Author),
}));

export const _PostToTag = mysqlTable(
  "_PostToTag",
  {
    A: int("A")
      .notNull()
      .references(() => Post.id),
    B: varchar("B", { length: 191 })
      .notNull()
      .references(() => Tag.name),
  },
  (table) => {
    return {
      // B_idx: index().on(table.B),
      _PostToTag_AB_unique: unique("_PostToTag_AB_unique").on(table.A, table.B),
    };
  }
);

export const _PostToTagRelation = relations(_PostToTag, ({ one }) => ({
  post: one(Post, {
    fields: [_PostToTag.A],
    references: [Post.id],
  }),
  tag: one(Tag, {
    fields: [_PostToTag.B],
    references: [Tag.name],
  }),
}));

export const _prisma_migrations = mysqlTable(
  "_prisma_migrations",
  {
    id: varchar("id", { length: 36 }).notNull(),
    checksum: varchar("checksum", { length: 64 }).notNull(),
    finished_at: datetime("finished_at", { mode: "string", fsp: 3 }),
    migration_name: varchar("migration_name", { length: 255 }).notNull(),
    logs: text("logs"),
    rolled_back_at: datetime("rolled_back_at", { mode: "string", fsp: 3 }),
    started_at: datetime("started_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    applied_steps_count: int("applied_steps_count").default(0).notNull(),
  },
  (table) => {
    return {
      _prisma_migrations_id: primaryKey(table.id),
    };
  }
);
