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
      const domain = await prisma.domain.findUnique({
        where: { author_id: session.user.id },
      });
      if (domain) {
        return domain;
      }
    } catch (e) {}
    return {
      __typename: "DomainNotFound",
      message: "Domain not linked",
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  createDomain: async (_, args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        __typename: "DomainError",
        message: "No session found",
      };
    }
    if (!args.name) {
      return {
        __typename: "DomainError",
        message: "Domain name is missing",
      };
    }
    const created = await prisma.domain.create({
      data: {
        name: args.name,
        ssl: false,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return created;
  },

  updateDomain: async (_, args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        __typename: "DomainError",
        message: "No session found",
      };
    }

    const updated = await prisma.domain.update({
      data: {
        ...args.data,
      },
      where: {
        author_id: session.user.id,
      },
    });

    return updated;
  },
};

export default { Query, Mutation };
