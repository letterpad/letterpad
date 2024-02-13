-- CreateTable
CREATE TABLE "FeaturedWeek" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "week_number" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "FeaturedWeek_post_id_idx" ON "FeaturedWeek"("post_id");
