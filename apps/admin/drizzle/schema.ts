import { sql } from "drizzle-orm";
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

export const author = mysqlTable(
  "Author",
  {
    id: int("id").autoincrement().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    password: varchar("password", { length: 191 }).notNull(),
    bio: text("bio").notNull(),
    occupation: varchar("occupation", { length: 100 }).notNull(),
    companyName: varchar("company_name", { length: 100 }).notNull(),
    avatar: varchar("avatar", { length: 300 }).notNull(),
    social: varchar("social", { length: 500 }).default("{}").notNull(),
    verified: tinyint("verified").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    verifyAttemptLeft: int("verify_attempt_left").default(3),
    roleId: int("role_id").notNull(),
    lastSeen: datetime("last_seen", { mode: "string", fsp: 3 }),
    loginType: varchar("login_type", { length: 191 })
      .default("credentials")
      .notNull(),
    analyticsId: int("analytics_id"),
    analyticsUuid: varchar("analytics_uuid", { length: 191 }),
    firstPostPublished: tinyint("first_post_published").default(0).notNull(),
    profileUpdated: tinyint("profile_updated").default(0).notNull(),
    settingsUpdated: tinyint("settings_updated").default(0).notNull(),
    stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
    registerStep: varchar("register_step", { length: 50 }).default(""),
  },
  (table) => {
    return {
      roleIdIdx: index("Author_role_id_idx").on(table.roleId),
      authorId: primaryKey(table.id),
      authorUsernameKey: unique("Author_username_key").on(table.username),
      authorEmailKey: unique("Author_email_key").on(table.email),
    };
  }
);

export const domain = mysqlTable(
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
    authorId: int("author_id").notNull(),
  },
  (table) => {
    return {
      domainId: primaryKey(table.id),
      domainAuthorIdKey: unique("Domain_author_id_key").on(table.authorId),
    };
  }
);

export const email = mysqlTable(
  "Email",
  {
    templateId: varchar("template_id", { length: 191 }).notNull(),
    subject: varchar("subject", { length: 191 }).notNull(),
    body: varchar("body", { length: 4000 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      //   emailId: primaryKey(table.id),
      emailTemplateIdKey: unique("Email_template_id_key").on(table.templateId),
    };
  }
);

export const emailDelivery = mysqlTable(
  "EmailDelivery",
  {
    id: int("id").autoincrement().notNull(),
    templateId: varchar("template_id", { length: 191 }),
    authorId: int("author_id"),
    postId: int("post_id"),
    subscriberId: int("subscriber_id"),
    delivered: int("delivered"),
    lastDeliveryAttempt: datetime("last_delivery_attempt", {
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
      emailDeliveryId: primaryKey(table.id),
    };
  }
);

export const permission = mysqlTable(
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
      permissionId: primaryKey(table.id),
      permissionNameKey: unique("Permission_name_key").on(table.name),
    };
  }
);

export const post = mysqlTable(
  "Post",
  {
    id: int("id").autoincrement().notNull(),
    title: varchar("title", { length: 191 }).default("").notNull(),
    html: text("html").notNull(),
    htmlDraft: text("html_draft"),
    excerpt: varchar("excerpt", { length: 191 }).default("").notNull(),
    coverImage: varchar("cover_image", { length: 255 }).default("").notNull(),
    coverImageWidth: int("cover_image_width").default(0).notNull(),
    coverImageHeight: int("cover_image_height").default(0).notNull(),
    type: varchar("type", { length: 191 }).default("post").notNull(),
    featured: tinyint("featured").default(0).notNull(),
    status: varchar("status", { length: 191 }).default("draft").notNull(),
    slug: varchar("slug", { length: 191 }).default("").notNull(),
    readingTime: varchar("reading_time", { length: 191 }).default("").notNull(),
    publishedAt: datetime("publishedAt", { mode: "string", fsp: 3 }),
    scheduledAt: datetime("scheduledAt", { mode: "string", fsp: 3 }),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    authorId: int("author_id").notNull(),
    pageData: text("page_data").notNull(),
    pageType: varchar("page_type", { length: 191 })
      .default("default")
      .notNull(),
    stats: varchar("stats", { length: 191 }).default("{}").notNull(),
    subTitle: varchar("sub_title", { length: 190 }).default("").notNull(),
  },
  (table) => {
    return {
      authorIdIdx: index("Post_author_id_idx").on(table.authorId),
      idxPostId: index("idx_post_id").on(table.id),
      idxPostSlug: index("idx_post_slug").on(table.slug),
      idxPostCreatedAt: index("idx_post_createdAt").on(table.createdAt),
      postId: primaryKey(table.id),
    };
  }
);

export const role = mysqlTable(
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
      roleId: primaryKey(table.id),
      roleNameKey: unique("Role_name_key").on(table.name),
    };
  }
);

export const rolePermissions = mysqlTable(
  "RolePermissions",
  {
    id: int("id").autoincrement().notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    roleId: int("role_id").notNull(),
    permissionId: int("permission_id").notNull(),
  },
  (table) => {
    return {
      permissionIdIdx: index("RolePermissions_permission_id_idx").on(
        table.permissionId
      ),
      roleIdIdx: index("RolePermissions_role_id_idx").on(table.roleId),
      rolePermissionsId: primaryKey(table.id),
    };
  }
);

export const setting = mysqlTable(
  "Setting",
  {
    id: int("id").autoincrement().notNull(),
    siteTitle: varchar("site_title", { length: 191 }).notNull(),
    siteTagline: varchar("site_tagline", { length: 191 }).notNull(),
    siteEmail: varchar("site_email", { length: 191 }).notNull(),
    siteUrl: varchar("site_url", { length: 191 }).notNull(),
    siteFooter: varchar("site_footer", { length: 191 }).notNull(),
    siteDescription: varchar("site_description", { length: 191 }).notNull(),
    subscribeEmbed: varchar("subscribe_embed", { length: 191 }).notNull(),
    displayAuthorInfo: tinyint("display_author_info").default(0).notNull(),
    cloudinaryKey: varchar("cloudinary_key", { length: 191 }).notNull(),
    cloudinaryName: varchar("cloudinary_name", { length: 191 }).notNull(),
    cloudinarySecret: varchar("cloudinary_secret", { length: 191 }).notNull(),
    menu: varchar("menu", { length: 500 }).default("[]").notNull(),
    css: varchar("css", { length: 500 }).notNull(),
    theme: varchar("theme", { length: 191 }).notNull(),
    clientToken: varchar("client_token", { length: 191 }).notNull(),
    banner: varchar("banner", { length: 300 }).default("{}").notNull(),
    siteLogo: varchar("site_logo", { length: 300 }).default("{}").notNull(),
    siteFavicon: varchar("site_favicon", { length: 300 })
      .default("{}")
      .notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    graphcommentId: varchar("graphcomment_id", { length: 191 })
      .default("")
      .notNull(),
    introDismissed: tinyint("intro_dismissed").notNull(),
    authorId: int("author_id").notNull(),
    showAboutPage: tinyint("show_about_page").default(1).notNull(),
    showTagsPage: tinyint("show_tags_page").default(0).notNull(),
    scripts: text("scripts"),
    design: varchar("design", { length: 300 }).default("{}").notNull(),
  },
  (table) => {
    return {
      settingId: primaryKey(table.id),
      settingAuthorIdKey: unique("Setting_author_id_key").on(table.authorId),
    };
  }
);

export const subscriber = mysqlTable(
  "Subscriber",
  {
    id: int("id").autoincrement().notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    authorId: int("author_id").notNull(),
    verified: tinyint("verified").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
    verifyAttemptLeft: int("verify_attempt_left").default(3),
  },
  (table) => {
    return {
      authorIdIdx: index("Subscriber_author_id_idx").on(table.authorId),
      subscriberId: primaryKey(table.id),
      subscriberEmailAuthorIdKey: unique("Subscriber_email_author_id_key").on(
        table.email,
        table.authorId
      ),
    };
  }
);

export const subscribersDelivery = mysqlTable(
  "SubscribersDelivery",
  {
    id: int("id").autoincrement().notNull(),
    subscriberId: varchar("subscriber_id", { length: 191 }),
    postId: int("post_id").notNull(),
    delivered: tinyint("delivered").notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 }).default(
      sql`CURRENT_TIMESTAMP(3)`
    ),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }),
  },
  (table) => {
    return {
      subscribersDeliveryId: primaryKey(table.id),
    };
  }
);

export const tag = mysqlTable(
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
      tagId: primaryKey(table.name),
      tagNameKey: unique("Tag_name_key").on(table.name),
    };
  }
);

export const upload = mysqlTable(
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
    authorId: int("author_id").notNull(),
  },
  (table) => {
    return {
      authorIdIdx: index("Upload_author_id_idx").on(table.authorId),
      uploadId: primaryKey(table.id),
    };
  }
);

export const postToTag = mysqlTable(
  "_PostToTag",
  {
    a: int("A").notNull(),
    b: varchar("B", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      // bIdx: index().on(table.b),
      postToTagAbUnique: unique("_PostToTag_AB_unique").on(table.a, table.b),
    };
  }
);

export const prismaMigrations = mysqlTable(
  "_prisma_migrations",
  {
    id: varchar("id", { length: 36 }).notNull(),
    checksum: varchar("checksum", { length: 64 }).notNull(),
    finishedAt: datetime("finished_at", { mode: "string", fsp: 3 }),
    migrationName: varchar("migration_name", { length: 255 }).notNull(),
    logs: text("logs"),
    rolledBackAt: datetime("rolled_back_at", { mode: "string", fsp: 3 }),
    startedAt: datetime("started_at", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    appliedStepsCount: int("applied_steps_count").default(0).notNull(),
  },
  (table) => {
    return {
      prismaMigrationsId: primaryKey(table.id),
    };
  }
);
