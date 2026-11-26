import { prisma } from "@/lib/prisma";
import { getRootUrl } from "@/shared/getRootUrl";

import { defaultSettings } from "../../db/seed/constants";

export async function ensureAuthorSetting(authorId: string) {
  const author = await prisma.author.findUnique({
    where: { id: authorId },
    select: { id: true, username: true },
  });
  if (!author) return null;

  const rootUrl = getRootUrl();
  return prisma.setting.upsert({
    where: { author_id: authorId },
    create: {
      ...defaultSettings,
      site_url: author.username
        ? `https://${author.username}.${new URL(rootUrl).hostname}`
        : rootUrl,
      author_id: authorId,
    },
    update: {},
  });
}
