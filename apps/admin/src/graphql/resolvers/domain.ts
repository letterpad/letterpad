import { SSL } from "@/lib/greenlock";

import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";

import { enqueueEmailAndSend } from "../mail/enqueueEmailAndSend";
import {
  createOrUpdateDomain,
  getDomain,
  removeDomain,
} from "../services/domain";
import { EmailTemplates } from "../types";

import { Optional } from "@/types";

const Query: Optional<QueryResolvers<ResolverContext>> = {
  domain: async (_root, _args, context) => {
    return getDomain(_args, context);
  },
};

const Mutation: Optional<MutationResolvers<ResolverContext>> = {
  removeDomain: async (_, _args, context) => {
    return removeDomain(_args, context);
  },
  createOrUpdateDomain: async (_, args, context) => {
    try {
      if (!context.session?.user || !args.data.name) {
        return {
          ok: false,
          message: "No session found",
        };
      }
      const ssl = new SSL();
      await ssl.add(args.data.name.trim());
      const domainExist = await context.prisma.domain.findFirst({
        where: {
          author: {
            id: context.session.user.id,
          },
        },
      });
      if (!domainExist) {
        await context.prisma.domain.create({
          data: {
            name: args.data.name.trim(),
            ssl: true,
            mapped: true,
            author: {
              connect: {
                id: context.session.user.id,
              },
            },
          },
        });
      } else {
        await context.prisma.domain.update({
          data: {
            ssl: true,
            mapped: true,
          },
          where: {
            author_id: context.session.user.id,
          },
        });
      }
      await enqueueEmailAndSend({
        author_id: context.session.user.id,
        template_id: EmailTemplates.DomainMapSuccess,
      });
      return {
        ok: true,
        message: "Congratulations! Your domain has been mapped with Letterpad",
      };
    } catch (e) {
      return createOrUpdateDomain(args, context);
    }
  },
};

export default { Query, Mutation };
