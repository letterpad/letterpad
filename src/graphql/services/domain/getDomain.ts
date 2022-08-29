import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getDomain = async (
  _args: unknown,
  { prisma, session }: ResolverContext,
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
      return {
        __typename: "Domain",
        ...domain,
      };
    }
  } catch (e) {
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
