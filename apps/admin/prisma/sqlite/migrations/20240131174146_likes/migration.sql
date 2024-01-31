-- CreateTable
CREATE TABLE "Follows" (
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Likes" (
    "post_id" INTEGER NOT NULL,
    "liked_by" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "Follows_following_id_idx" ON "Follows"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "Follows_follower_id_following_id_key" ON "Follows"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "Likes_liked_by_idx" ON "Likes"("liked_by");

-- CreateIndex
CREATE INDEX "Likes_post_id_idx" ON "Likes"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "Likes_post_id_liked_by_key" ON "Likes"("post_id", "liked_by");
