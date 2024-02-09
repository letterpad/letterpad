import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

import { check } from "./check";

// import { check } from "./check";

export const getDomain = async (
  _args: unknown,
  { prisma, session }: ResolverContext
): Promise<ResolversTypes["DomainResponse"]> => {
  if (!session?.user.id) {
    return {
      __typename: "DomainNotFound",
      message: "No Session found",
    };
  }
  try {
    const domain = await prisma.domain.findFirst({
      where: { author_id: session.user.id },
    });
    if (domain) {
      const res = await check(domain.name);
      return {
        __typename: "Domain",
        ...domain,
        ...res,
      };
    }
  } catch (e: any) {
    return {
      __typename: "DomainNotFound",
      message: e.message,
    };
  }
  return {
    __typename: "DomainNotFound",
    message: "Domain not linked",
  };
};
