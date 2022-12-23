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

  await prisma.domain.delete({ where: { author_id: session.user.id } });

  return { ok: true, message: "Domain removed" };
};
