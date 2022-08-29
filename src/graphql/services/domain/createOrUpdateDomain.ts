import {
  MutationCreateOrUpdateDomainArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { enqueueEmailAndSend } from "@/graphql/mail/enqueueEmailAndSend";
import { EmailTemplates } from "@/graphql/types";
import { execShellCommand } from "@/shared/execShellCommand";

export const createOrUpdateDomain = async (
  args: MutationCreateOrUpdateDomainArgs,
  { prisma, session }: ResolverContext,
): Promise<ResolversTypes["UpdateDomainResponse"]> => {
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
      const nginxConfig_p80 = await execShell("nginxSetConfig_80", domainName);
      if (!nginxConfig_p80.ok) {
        return { ...nginxConfig_p80 };
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
      await enqueueEmailAndSend({
        author_id: session.user.id,
        template_id: EmailTemplates.DomainMapSuccess,
        domain_name: domainName,
      });
      return {
        ok: true,
        message: "Congratulations! Your domain has been mapped with Letterpad",
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
};

async function execShell(fn, domain = "") {
  try {
    const result = await execShellCommand(
      `./scripts/domainMapping.sh ${fn} ${domain}`.trim(),
    );
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
    return {
      ok: false,
      message: e.message,
    };
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
