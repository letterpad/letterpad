import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

import { check } from "./check";

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

  const domain = await prisma.domain.findFirst({
    where: { author_id: session.user.id },
  });

  if (!domain) {
    return {
      ok: false,
      message: "No domain found",
    };
  }
  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain.name}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
        },
        method: "DELETE",
      }
    );

    const json = await response.json();
    await check(domain.name);
    // eslint-disable-next-line no-console
    console.log(json);
    await prisma.domain.delete({ where: { author_id: session.user.id } });

    return { ok: true, message: "Domain removed" };
  } catch (err: any) {
    return {
      ok: false,
      message: err.message,
    };
  }
};
