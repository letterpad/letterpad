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
  try {
    return await prisma.setting.upsert({
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
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      const setting = await prisma.setting.findUnique({
        where: { author_id: authorId },
      });
      if (setting) return setting;
    }
    throw error;
  }
}
