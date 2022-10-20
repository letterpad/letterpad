import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

import { deleteMedia, getMedia, updateMedia } from "../services/media";

const Query: QueryResolvers<ResolverContext> = {
  media: async (_root, args, context) => {
    return getMedia(args, context);
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  deleteMedia: async (_, args, context) => {
    return deleteMedia(args, context);
  },

  updateMedia: async (_, args, context) => {
    return updateMedia(args, context);
  },
};

export default { Query, Mutation };
