-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "signature" TEXT NOT NULL DEFAULT '',
    "company_name" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "social" TEXT NOT NULL DEFAULT '{}',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "verify_attempt_left" INTEGER DEFAULT 3,
    "analytics_id" INTEGER,
    "analytics_uuid" TEXT,
    "register_step" TEXT DEFAULT '',
    "role_id" INTEGER NOT NULL,
    "login_type" TEXT NOT NULL DEFAULT 'credentials',
    "last_seen" DATETIME,
    "first_post_published" BOOLEAN NOT NULL DEFAULT false,
    "settings_updated" BOOLEAN NOT NULL DEFAULT false,
    "profile_updated" BOOLEAN NOT NULL DEFAULT false,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT
);
INSERT INTO "new_Author" ("analytics_id", "analytics_uuid", "avatar", "bio", "company_name", "createdAt", "email", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "social", "stripe_customer_id", "stripe_subscription_id", "updatedAt", "username", "verified", "verify_attempt_left") SELECT "analytics_id", "analytics_uuid", "avatar", "bio", "company_name", "createdAt", "email", "first_post_published", "id", "last_seen", "login_type", "name", "occupation", "password", "profile_updated", "register_step", "role_id", "settings_updated", "social", "stripe_customer_id", "stripe_subscription_id", "updatedAt", "username", "verified", "verify_attempt_left" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
CREATE UNIQUE INDEX "Author_username_key" ON "Author"("username");
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");
CREATE INDEX "Author_role_id_idx" ON "Author"("role_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
