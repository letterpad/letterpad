import {
  QueryResolvers,
  MutationResolvers,
  PostStatusOptions,
  Tags as TagsType,
} from "@/__generated__/__types__";
import { ResolverContext } from "../context";

const Query: QueryResolvers<ResolverContext> = {
  async tag(_root, args, { session, author_id, prisma }) {
    const authorId = session?.user.id || author_id;

    if (!authorId) {
      return {
        __typename: "TagResultError",
        message: "You dont have access to get this resource",
      };
    }

    const tag = await prisma.tag.findFirst({
      where: { slug: args.slug },
    });

    if (tag) {
      return {
        __typename: "Tags",
        ...(tag as TagsType),
      };
    }
    return {
      __typename: "TagResultError",
      message: "Tag not found",
    };
  },
  async tags(_root, args, { session, author_id, prisma }) {
    const authorId = session?.user.id || author_id;

    if (!authorId) {
      return {
        __typename: "TagsError",
        message: "Missing or invalid token or session",
      };
    }
    try {
      const tags = await prisma.tag.findMany({
        where: {
          name: args.filters?.name,
          posts: {
            some: {
              status: args.filters?.active
                ? PostStatusOptions.Published
                : undefined,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      return {
        __typename: "TagsNode",
        rows: tags as TagsType[],
      };
    } catch (e) {}
    return {
      __typename: "TagsError",
      message: "Missing or invalid token or session",
    };
  },
};

const Tags = {
  async slug({ slug }) {
    return "/tag/" + slug.replace("/tag/", "");
  },
  async posts({ name }, _args, { prisma }: ResolverContext) {
    const posts = await prisma.post.findMany({
      where: {
        tags: {
          some: {
            name,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      __typename: "PostsNode",
      count: posts?.length,
      rows: posts,
    };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async updateTags(_root, args, { session, prisma }) {
    if (!session?.user) {
      return {
        __typename: "TagsError",
        message: "No session found",
      };
    }

    const author = await prisma.author.findFirst({
      where: { id: session.user.id },
    });

    if (!args.data || !author) {
      return {
        __typename: "TagsError",
        message: "Incorrect arguments",
      };
    }

    const oldName = args.data.old_name;
    const newName = args.data.name.toLowerCase();
    const newSlug = newName.replace(/ /g, "-").toLowerCase();

    const linkedPosts = await prisma.post.findMany({
      select: {
        id: true,
      },
      where: {
        author: {
          id: author.id,
        },
        tags: {
          some: {
            name: oldName,
          },
        },
      },
    });

    for (let i = 0; i < linkedPosts.length; i++) {
      const { id } = linkedPosts[i];
      await prisma.post.update({
        data: {
          tags: {
            disconnect: {
              name: oldName,
            },
            connectOrCreate: {
              create: {
                name: newName,
                slug: newSlug,
              },
              where: {
                name: newName,
              },
            },
          },
        },
        where: {
          id,
        },
      });
    }

    return {
      __typename: "EditTaxResponse",
      ok: true,
    };
  },

  async deleteTags(_root, args, { prisma, session }) {
    if (!args.name) {
      return {
        __typename: "TagsError",
        message: "Incorrect arguments",
      };
    }
    const linkedPosts = await prisma.post.findMany({
      select: {
        id: true,
      },
      where: {
        author: {
          id: session?.user.id,
        },
        tags: {
          some: {
            name: args.name,
          },
        },
      },
    });

    for (let i = 0; i < linkedPosts.length; i++) {
      const { id } = linkedPosts[i];
      await prisma.post.update({
        data: {
          tags: {
            disconnect: {
              name: args.name,
            },
          },
        },
        where: {
          id,
        },
      });
    }

    return {
      __typename: "DeleteTagsResult",
      ok: true,
    };
  },
};
export default { Query, Tags, Mutation };
