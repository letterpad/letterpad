import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { Optional } from "@/shared/types";

import {
  createOrUpdateDomain,
  getDomain,
  removeDomain,
} from "../services/domain";

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
    return createOrUpdateDomain(args, context);
  },
};

export default { Query, Mutation };
