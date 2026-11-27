import { createUsernameSuggestion, usernameMaxLength } from "@/shared/username";
import { sanitizeUsername } from "@/shared/utils";

import { prisma } from "@/lib/prisma";

export async function generateAvailableUsername(
  name?: string | null,
  email?: string | null
) {
  let base = createUsernameSuggestion(name, email);
  if (!sanitizeUsername(base)) base = `${base}-writer`.slice(0, usernameMaxLength);

  for (let suffix = 1; ; suffix += 1) {
    const suffixText = suffix === 1 ? "" : `-${suffix}`;
    const candidate = `${base.slice(0, usernameMaxLength - suffixText.length)}${suffixText}`;
    const existing = await prisma.author.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
}
