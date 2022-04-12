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

      if (args.data.name && !domainExist) {
        const mapped = await validateIpMapping(args.data.name);
        if (mapped.ok) {
          await prisma.domain.create({
            data: {
              name: args.data.name,
              ssl: false,
              mapped: true,
              author: {
                connect: {
                  id: session.user.id,
                },
              },
            },
          });
          const ssl = await genCertificates(args.data.name);
          if (ssl.ok) {
            await prisma.domain.update({
              data: {
                ssl: true,
                mapped: true,
              },
              where: {
                author_id: session.user.id,
              },
            });
          }
          return ssl;
        }
        return mapped;
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

async function validateIpMapping(domainName: string) {
  try {
    const result = await execShellCommand(
      `./scripts/nginx_template_nossl.sh ${domainName}`,
    );
    console.log("IP Mapping", result);
    if (result === "Success") {
      return { ok: true };
    }
  } catch (e) {
    return {
      ok: false,
      message: e.message,
    };
  }
  return {
    ok: false,
    message: "Uncaught Error. Please try again later.",
  };
}

async function genCertificates(domainName: string) {
  try {
    const result2 = await execShellCommand(
      `./scripts/nginx_template_ssl.sh ${domainName}`,
    );
    console.log("Certificates", domainName);
    if (result2.includes("Congratulations!")) {
      if (result2.includes("Letterpad")) {
        if (result2.includes("200")) {
          return {
            ok: true,
          };
        } else if (result2.includes("301")) {
          return {
            ok: true,
            message:
              "Domain mapped successfully. However, it looks like your domain is causing a redirect.",
          };
        }
      }
    }
  } catch (e) {
    return {
      ok: false,
      message: e.message,
    };
  }
  return {
    ok: false,
    message: "Uncaught Error. Please try again later.",
  };
}
