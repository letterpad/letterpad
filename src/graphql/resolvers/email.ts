import { QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "../apollo";
import models from "@/graphql/db/models";

const Query: QueryResolvers<ResolverContext> = {
  email: async (_root, args, { session }) => {
    if (!session?.user.id) {
      return {
        message: "You need to be authenticated to see this",
      };
    }
    const template = await models.Email.findOne({
      where: { template_id: args.template_id },
    });
    if (template) return template;
    return {
      message: "Template not found",
    };
  },
  emails: async (_root, _args, { session }) => {
    if (!session?.user.id) {
      return [];
    }
    return models.Email.findAll();
  },
};
export default { Query };
