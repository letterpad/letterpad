-- CreateTable
CREATE TABLE "EmailTemplates" (
    "template" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplates_template_key" ON "EmailTemplates"("template");
