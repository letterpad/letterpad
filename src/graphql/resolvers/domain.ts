import { execShellCommand } from "@/shared/execShellCommand";
import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "../context";

const Query: QueryResolvers<ResolverContext> = {
  domain: async (_root, _args, { session, prisma }) => {
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
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  createOrUpdateDomain: async (_, args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        ok: false,
        message: "No session found",
      };
    }

    try {
      const domainExist = await prisma.domain.findFirst({
        where: {
          author: {
            id: session.user.id,
          },
        },
      });

      if (domainExist) {
        await prisma.domain.update({
          data: {
            ...args.data,
          },
          where: {
            author_id: session.user.id,
          },
        });

        return {
          ok: true,
        };
      } else if (args.data.name) {
        await prisma.domain.create({
          data: {
            name: args.data.name,
            ssl: false,
            author: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        return await genCertificates(args.data.name);
      }

      return {
        ok: false,
        message: "Incorrect arguments",
      };
    } catch (e) {
      return {
        ok: false,
        message: e.message,
      };
    }
  },
};

export default { Query, Mutation };

async function genCertificates(domainName: string) {
  try {
    const no_ssl = await execShellCommand(
      `./scripts/nginx_template_nossl.sh ${domainName}`,
    );
    if (no_ssl.includes("Congratulations!")) {
      await execShellCommand(`./scripts/nginx_template_ssl.sh ${domainName}`);
    }
  } catch (e) {
    return {
      ok: false,
      message: e.message,
    };
  }
  return {
    ok: true,
  };
}
