import { Prisma } from "@prisma/client";

import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";

import { ResolverContext } from "../context";

const Query: QueryResolvers<ResolverContext> = {
  media: async (_root, args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        count: 0,
        rows: [],
      };
    }

    if (args.filters) {
      const { id, cursor, limit = 20, page = 1 } = args.filters;

      const condition: Prisma.UploadFindManyArgs = {
        where: {
          author: {
            id: session.user.id,
          },
        },
        take: limit,

        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        skip: (page - 1) * limit,
      };

      const result = await prisma.upload.findMany(condition);

      return {
        rows: result,
        count: await prisma.upload.count({
          where: { id, author: { id: session.user.id } },
        }),
      };
    }

    return {
      count: 0,
      rows: [],
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  deleteMedia: async (_, args, { session, prisma }) => {
    if (!session?.user) {
      return {
        __typename: "MediaError",
        message: "No Auhentication",
      };
    }

    await prisma.upload.deleteMany({
      where: {
        id: {
          in: args.ids,
        },
        author: {
          id: session.user.id,
        },
      },
    });

    return {
      __typename: "MediaDeleteResult",
      ok: true,
    };
  },

  updateMedia: async (_, args, { session, prisma }) => {
    if (!session?.user.id) {
      return {
        __typename: "MediaError",
        message: "No Auhentication",
      };
    }

    await prisma.author.update({
      data: {
        uploads: {
          update: {
            data: args.data,
            where: {
              id: args.data.id,
            },
          },
        },
      },
      where: {
        id: session.user.id,
      },
    });
    return {
      __typename: "MediaUpdateResult",
      ok: true,
    };
  },
};

export default { Query, Mutation };
