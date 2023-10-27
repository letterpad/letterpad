const prismaSchemas = [
    `model Author {
  id                  Int          @id @default(autoincrement())
  name                String
  username            String       @unique
  email               String       @unique
  password            String
  bio                 String       @db.Text
  occupation          String       @db.VarChar(100)
  company_name        String       @db.VarChar(100)
  avatar              String       @db.VarChar(300)
  social              String       @default("{}") @db.VarChar(500)
  verified            Boolean      @default(false)
  createdAt           DateTime?    @default(now())
  updatedAt           DateTime?    @updatedAt
  verify_attempt_left Int?         @default(3)
  analytics_id        Int?
  analytics_uuid      String?
  role_id             Int
  login_type          String       @default("credentials")
  last_seen           DateTime?
  register_step       String?     @default("")   @db.VarChar(50)
  role                Role         @relation(fields: [role_id], references: [id])
  domain              Domain?
  posts               Post[]
  setting             Setting?
  subscribers         Subscriber[]
  uploads             Upload[]
  first_post_published Boolean      @default(false)
  settings_updated    Boolean      @default(false)
  profile_updated      Boolean      @default(false)
  stripe_customer_id  String?
  stripe_subscription_id String?

  @@index([role_id])
}
`,
`model EmailDelivery {
  id                    Int       @id @default(autoincrement())
  template_id           String?
  author_id             Int?
  post_id               Int?
  subscriber_id         Int?
  delivered             Int?
  last_delivery_attempt DateTime?
  createdAt             DateTime? @default(now())
  updatedAt             DateTime? @updatedAt
}
`,
`model Email {
  template_id String    @id @unique
  subject     String
  body        String    @db.VarChar(4000)
  createdAt   DateTime? @default(now())
  updatedAt   DateTime? @updatedAt
}
`,
`model Permission {
  id        Int               @id @default(autoincrement())
  name      String?           @unique
  createdAt DateTime?         @default(now())
  updatedAt DateTime?         @updatedAt
  roles     RolePermissions[]
}
`,
`model Post {
  id                 Int       @id @default(autoincrement())
  title              String    @default("")
  sub_title          String    @db.VarChar(190) @default("")
  html               String    @db.Text
  html_draft         String?   @db.Text
  excerpt            String    @default("")
  cover_image        String    @default("") @db.VarChar(255)
  cover_image_width  Int       @default(0)
  cover_image_height Int       @default(0)
  type               String    @default("post")
  featured           Boolean   @default(false)
  status             String    @default("draft")
  slug               String    @default("")
  reading_time       String    @default("")
  publishedAt        DateTime?
  scheduledAt        DateTime?
  updatedAt          DateTime? @updatedAt
  createdAt          DateTime? @default(now())
  author_id          Int
  author             Author?    @relation(fields: [author_id], references: [id], onDelete: Cascade)
  tags               Tag[]
  page_type          String    @default("default")
  page_data          String    @db.Text
  stats              String    @default("{}")
  @@index([author_id])
}
`,
`model RolePermissions {
  id            Int        @id @default(autoincrement())
  createdAt     DateTime?  @default(now())
  updatedAt     DateTime?  @updatedAt
  role_id       Int
  permission_id Int
  permission    Permission @relation(fields: [permission_id], references: [id], onDelete: Cascade)
  role          Role       @relation(fields: [role_id], references: [id], onDelete: Cascade)

  @@index([permission_id])
  @@index([role_id])
}
`,
`model Role {
  id          Int               @id @default(autoincrement())
  name        String?           @unique
  createdAt   DateTime?         @default(now())
  updatedAt   DateTime?         @updatedAt
  author      Author[]
  permissions RolePermissions[]
}
`,
`model Setting {
  id                  Int       @id @default(autoincrement())
  site_title          String
  site_tagline        String
  site_email          String
  site_url            String
  site_footer         String
  site_description    String
  subscribe_embed     String
  display_author_info Boolean   @default(false)
  cloudinary_key      String
  cloudinary_name     String
  cloudinary_secret   String
  menu                String    @default("[]") @db.VarChar(500)
  css                 String    @db.VarChar(500)
  theme               String
  client_token        String
  banner              String    @default("{}") @db.VarChar(300)
  site_logo           String    @default("{}") @db.VarChar(300)
  site_favicon        String    @default("{}") @db.VarChar(300)
  createdAt           DateTime? @default(now())
  updatedAt           DateTime? @updatedAt
  graphcomment_id     String    @default("")
  intro_dismissed     Boolean
  show_about_page     Boolean   @default(true)
  show_tags_page      Boolean   @default(false)
  design              String    @default("{}") @db.VarChar(300)
  scripts             String?   @db.Text
  author_id           Int       @unique
  author              Author    @relation(fields: [author_id], references: [id], onDelete: Cascade)

  @@index([author_id])
}
`,
`model Subscriber {
  id                  Int       @id @default(autoincrement())
  email               String
  author_id           Int
  verified            Boolean   @default(false)
  createdAt           DateTime? @default(now())
  updatedAt           DateTime? @updatedAt
  verify_attempt_left Int?      @default(3)
  author              Author?    @relation(fields: [author_id], references: [id], onDelete: Cascade)

  @@unique([email, author_id])
  @@index([author_id])
}
`,
`model Tag {
  name      String    @id @unique
  desc      String?   @default("")
  slug      String?
  createdAt DateTime? @default(now())
  updatedAt DateTime? @updatedAt
  posts     Post[]
}
`,
`model Upload {
  id          Int       @id @default(autoincrement())
  name        String
  url         String
  width       Int
  height      Int
  description String    @default("")
  updatedAt   DateTime? @updatedAt
  createdAt   DateTime? @default(now())
  author_id   Int
  author      Author?   @relation(fields: [author_id], references: [id], onDelete: Cascade)

  @@index([author_id])
}
`,
`model Domain {
  id        Int       @id @default(autoincrement())
  name      String
  mapped    Boolean   @default(false)
  ssl       Boolean
  updatedAt DateTime? @updatedAt
  createdAt DateTime? @default(now())
  author_id Int       @unique
  author    Author?    @relation(fields: [author_id], references: [id], onDelete: Cascade)
}
`,
`model SubscribersDelivery {
  id            Int       @id @default(autoincrement())
  subscriber_id String?
  post_id       Int
  delivered     Boolean
  createdAt     DateTime? @default(now())
  updatedAt     DateTime? @updatedAt
}
`,
];

const convertPrismaToDrizzle = (prismaSchemas: string[]) => {
    prismaSchemas.forEach((prismaSchema) => {
        const schemaFields = prismaSchema.split(/\r?\n/);
        schemaFields.pop();
        const interestedParts = schemaFields;
        const modelName = interestedParts?.[0]
            ?.match(/(?<=(model)+)(.*?)(?=\{)/)?.[0]
            ?.trim()
            ?.toLowerCase();

        let drizzleFields = [];
        drizzleFields.push(`export const ${modelName} = sqliteTable("${modelName}", {`);
        for (let i = 1; i < interestedParts?.length; i++) {
            let field;

            if (interestedParts[i]?.indexOf('@relation') >= 0) {
                field = extractRelation(interestedParts[i]);
            } else {
                field = interestedParts[i].trim().replace(/[ ,]+/g, ',');
            }

            const parts = field ? field.split(',') : null;
            const snakeCase = parts?.[0] ? parts[0].replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) : parts?.[0];
            const relation = parts?.[3] && parts?.[3] != null && parts?.[3] != undefined ? parts?.[3] : parts?.[2];
            const type = parts?.[1] ? convertType(parts[1], snakeCase, relation) : parts?.[1];
            const decorator = convertRelation(relation, parts?.[1], snakeCase);
            const final = parts?.[0] + ': ' + type + decorator;
            drizzleFields.push(final);
        }
        drizzleFields.push('}');
        console.log(drizzleFields.join('\n\t'));
    });
};

const extractRelation = (part: string) => {
    let matches = part.match('@relation');
    if (matches && matches.length > 0 && matches?.index) {
        let relationPart = part.substr(matches.index, part.length);
        let fieldPart = part.replace(relationPart, '').trim().replace(/[ ,]+/g, ',');
        // console.log(fieldPart + "," +relationPart);
        return fieldPart + ',' + relationPart;
    } else {
        return part;
    }
};

const convertType = (type: string | null | undefined, snakecase: string | null | undefined, relation?: string | null) => {
    if (type) {
        if (type.indexOf('Int?') >= 0 && type.indexOf('Int?') >= 0) {
            return 'integer("' + snakecase + '")';
        } else if (type.indexOf('Int') >= 0 && type.indexOf('Int?') < 0) {
            return 'integer("' + snakecase + '").notNull()';
        } else if (type.indexOf('String') >= 0) {
            return 'text("' + snakecase + '")';
        } else if (type.indexOf('Boolean') >= 0) {
            return 'integer("' + snakecase + '")';
        } else if (type.indexOf('DateTime') >= 0) {
            return "integer('created_at', { mode: 'timestamp' })";
        } else {
            const value = relation?.split('references: [')?.[1]?.replace(']', '');
            return "text('" + type?.toLowerCase()?.replace('?', '') + '_' + value + "')";
        }
    } else {
        return type;
    }
};

const convertRelation = (relation: string | null | undefined, type?: string | null, snakeCase?: string | null) => {
    if (!relation) {
        return ',';
    }

    if (relation.indexOf('@default') >= 0 && relation.indexOf('autoincrement()') < 0 && relation.indexOf('@default(now())') < 0) {
        let value;

        if (type && type?.indexOf('Boolean') >= 0) {
            value = relation?.replace('@default(', '').replace(')', '');
            value = value == 'true' ? '1' : '0';
        } else {
            value = relation.indexOf("@default('") >= 0 ? relation?.replace("@default('", '').replace("')", '') : relation?.replace('@default(', '').replace(')', '');
        }

        return relation.indexOf("@default('") >= 0 ? '.default("' + value + '"),' : '.default(' + value + '),';
    } else if (relation.indexOf('@default(now())') >= 0) {
        return ".default(sql`(strftime('%s', 'now'))`),";
    } else if (relation.indexOf('@default') >= 0 && relation.indexOf('autoincrement()') >= 0) {
        return '.primaryKey(),';
    } else if (relation.indexOf('references') >= 0 && type) {
        const value = relation?.split('references: [')?.[1]?.replace(']', '');
        return '.references(()=> ' + snakeCase + '.' + value + ',';
    } else {
        return '';
    }
};

convertPrismaToDrizzle(prismaSchemas);