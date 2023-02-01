import {
  PostStatusOptions,
  PostTypes,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getStats = async (
  _,
  { client_author_id, session, prisma }: ResolverContext
): Promise<ResolversTypes["StatsResponse"]> => {
  const result = {
    posts: { published: 0, drafts: 0, trashed: 0 },
    pages: { published: 0, drafts: 0, trashed: 0 },
    tags: 0,
    media: 0,
  };
  client_author_id = session?.user.id || client_author_id;

  if (!client_author_id) {
    return {
      __typename: "StatsError",
      message: "Couldnt find author in session",
    };
  }

  const author = await prisma.author.findFirst({
    where: { id: client_author_id },
  });

  if (!author) {
    return {
      __typename: "StatsError",
      message: "Couldnt find author",
    };
  }

  result.posts.published = await prisma.post.count({
    where: {
      status: PostStatusOptions.Published,
      type: PostTypes.Post,
      author: {
        id: client_author_id,
      },
    },
  });

  result.posts.drafts = await prisma.post.count({
    where: {
      status: PostStatusOptions.Draft,
      type: PostTypes.Post,
      author: {
        id: client_author_id,
      },
    },
  });

  result.posts.trashed = await prisma.post.count({
    where: {
      status: PostStatusOptions.Trashed,
      type: PostTypes.Post,
      author: {
        id: client_author_id,
      },
    },
  });

  result.pages.published = await prisma.post.count({
    where: {
      status: PostStatusOptions.Published,
      type: PostTypes.Page,
      author: {
        id: client_author_id,
      },
    },
  });

  result.pages.drafts = await prisma.post.count({
    where: {
      status: PostStatusOptions.Draft,
      type: PostTypes.Page,
      author: {
        id: client_author_id,
      },
    },
  });

  result.pages.drafts = await prisma.post.count({
    where: {
      status: PostStatusOptions.Trashed,
      type: PostTypes.Page,
      author: {
        id: client_author_id,
      },
    },
  });

  result.tags = await prisma.tag.count({
    where: {
      posts: {
        some: {
          author: {
            id: client_author_id,
          },
        },
      },
    },
  });

  result.media = await prisma.upload.count({
    where: { author: { id: client_author_id } },
  });

  return {
    __typename: "Stats",
    ...result,
  };
};
