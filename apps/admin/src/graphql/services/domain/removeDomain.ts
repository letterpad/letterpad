import { SSL } from "@/lib/greenlock";

import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const removeDomain = async (
  _args: unknown,
  { prisma, session }: ResolverContext
): Promise<ResolversTypes["RemoveDomainResponse"]> => {
  if (!session?.user.id) {
    return {
      ok: false,
      message: "No session found",
    };
  }
  const ssl = new SSL();
  const domain = await prisma.domain.findFirst({
    where: { author_id: session.user.id },
  });
  if (domain) await ssl.delete(domain?.name);
  await prisma.domain.delete({ where: { author_id: session.user.id } });

  return { ok: true, message: "Domain removed" };
};
