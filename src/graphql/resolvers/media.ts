import { MutationResolvers, QueryResolvers } from "@/__generated__/__types__";
import { Prisma } from "@prisma/client";
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
      const { id, authorId, cursor, limit = 20, page = 0 } = args.filters;

      const condition: Prisma.UploadFindManyArgs = {
        where: {
          id,
          author: {
            id: authorId,
          },
        },
        take: limit,

        cursor: {
          id: cursor,
        },
        skip: page * limit,
      };
      const result = await prisma.upload.findMany(condition);

      return {
        rows: result,
        count: await prisma.upload.count({
          where: { id, author: { id: authorId } },
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
  deleteMedia: async (_, args, { session, models }) => {
    if (!session?.user) {
      return {
        __typename: "MediaError",
        message: "No Auhentication",
      };
    }
    const author = await models.Author.findOne({
      where: { id: session.user.id },
    });
    if (!author) {
      return {
        __typename: "MediaError",
        message: "Author not found",
      };
    }
    await Promise.all([
      ...args.ids.map((id) =>
        models.Upload.destroy({
          where: { id: id, author_id: session.user.id },
        }),
      ),
    ]);

    return {
      __typename: "MediaDeleteResult",
      ok: true,
    };
  },

  updateMedia: async (_, args, { session, models }) => {
    if (!session?.user) {
      return {
        __typename: "MediaError",
        message: "No Auhentication",
      };
    }

    const [updates] = await models.Upload.update(args.data, {
      where: { id: args.data.id, author_id: session.user.id },
    });

    if (updates === 0) {
      return {
        __typename: "MediaError",
        message: "Media not found",
      };
    }
    return {
      __typename: "MediaUpdateResult",
      ok: true,
    };
  },
};

export default { Query, Mutation };
