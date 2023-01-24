import { ssl } from "@/lib/greenlock";

import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import logger from "@/shared/logger";

import {
  createOrUpdateDomain,
  getDomain,
  removeDomain,
} from "../services/domain";

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
    if (context.session?.user.email === "abhisheksaha11@gmail.com") {
      try {
        const res = await ssl.delete(args.data.name?.trim()!);
        logger.info("delete", res);
        const result = await ssl.add(args.data.name?.trim()!);
        logger.info("result", result);

        return {
          ok: true,
        };
      } catch (e) {
        logger.error("error", e);
        return {
          ok: false,
          message: e.message,
        };
      }
    } else {
      return createOrUpdateDomain(args, context);
    }
  },
};

export default { Query, Mutation };
