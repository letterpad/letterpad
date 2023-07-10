import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

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

const check = async (domain: string) => {
  const [configResponse, domainResponse] = await Promise.all([
    fetch(
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    ),
    fetch(
      `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domain}?teamId=${process.env.VERCEL_TEAM_ID}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    ),
  ]);

  const configJson = await configResponse.json();
  const domainJson = await domainResponse.json();
  if (domainResponse.status !== 200) {
    return domainJson;
  }
  return {
    configured: !configJson.misconfigured,
    ...domainJson,
  };
};
