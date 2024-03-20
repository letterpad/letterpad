import { QueryResolvers } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";

const Query: QueryResolvers<ResolverContext> = {
  email: async (_root, args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        message: "You need to be authenticated to see this",
      };
    }
    const template = await prisma.email.findFirst({
      where: { template_id: args.template_id },
    });
    if (template) return template;
    return {
      message: "Template not found",
    };
  },
  emails: async (_root, _args, { session, prisma }) => {
    if (!session?.user.id) {
      return [];
    }
    return prisma.email.findMany();
  },
};
export default { Query };
