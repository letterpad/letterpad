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
  removeDomain: async (_, _args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        ok: false,
        message: "No session found",
      };
    }

    await prisma.domain.delete({ where: { author_id: session.user.id } });

    return { ok: true };
  },
  createOrUpdateDomain: async (_, args, { session, prisma }) => {
    if (!session?.user.id || !args.data.name) {
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
      const domainName = args.data.name?.trim();
      if (args.data.name && !domainExist) {
        const nginxConfig_p80 = await execShell(
          "nginxSetConfig_80",
          domainName,
        );
        if (!nginxConfig_p80.ok) {
          return nginxConfig_p80;
        }
        // to be safe, remove prev domain mapping
        await execShell("removeDomainMapping", domainName);

        const certificates = await execShell("createCertificate", domainName);
        if (!certificates.ok) return certificates;

        await execShell("nginxSetConfig_443", domainName);
        await wait(200);
        const verify = await execShellCommand(
          `./scripts/domainMapping.sh verifySSL ${domainName}`,
        );

        await prisma.domain.create({
          data: {
            name: domainName,
            ssl: true,
            mapped: true,
            author: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        if (verify.includes("301")) {
          return {
            ok: true,
            message:
              "SSL has been configured. However, your domain is in a redirect loop. This is usually because your domain is reconfiguring the SSL. Contact your domain provider regarding this.",
          };
        }
        return {
          ok: true,
          message:
            "Congratulations! Your domain has been mapped with Letterpad",
        };
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

async function execShell(fn, domain = "") {
  try {
    const result = await execShellCommand(
      `./scripts/domainMapping.sh ${fn} ${domain}`.trim(),
    );
    console.log(fn, result);
    if (result.includes("success")) {
      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        message: result,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      ok: false,
      message: e.message,
    };
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
