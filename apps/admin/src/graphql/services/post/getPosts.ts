import { Prisma, PrismaClient } from "@prisma/client";

import {
  NavigationType,
  PostStatusOptions,
  PostTypes,
  QueryPostsArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { getLastPartFromPath } from "@/utils/slug";

import { tryToParseCategoryName } from "../../../utils/utils";
import { cache } from "react";

export const getPosts = cache(async (
  args: QueryPostsArgs,
  context: ResolverContext
): Promise<ResolversTypes["PostsResponse"]> => {
  const { session, client_author_id, prisma } = context;
  const session_author_id = session?.user.id;
  const authorId = session_author_id || client_author_id;
  if (!authorId) {
    return {
      __typename: "UnAuthorized",
      message:
        "Either use session or add a valid Authorization token in the header.",
    };
  }
  if (!args.filters) {
    args.filters = {};
  }

  // if there is no session, do not show draft or deleted items.
  if (!session_author_id) {
    args.filters.status = [PostStatusOptions.Published];
  }

  // First verify if posts are requested from client and not admin dashboard.
  // If posts are requested by client, then verify if this a collection of posts for
  // displaying in homepage.
  // find the real slug of the tag
  if (args.filters?.tagSlug === "/") {
    // find the first menu item. If its a tag, then display its collection of posts.
    const slug = await getTagSlugOfFirstMenuItemIfPossible(
      prisma,
      authorId,
      context
    );
    if (slug) args.filters.tagSlug = slug;
  } else if (args.filters.tagSlug) {
    args.filters.tagSlug = tryToParseCategoryName(
      getLastPartFromPath(args.filters.tagSlug)
    );
  }
  const { page = 1, limit = 10 } = args.filters;
  const skip = page && limit ? (page - 1) * limit : 0;
  const isPage = args.filters.type === PostTypes.Page;

  const condition: Prisma.PostFindManyArgs = {
    where: {
      author_id: authorId,
      // id: args.filters?.id,
      featured: args.filters?.featured,
      status: {
        in: session?.user.id
          ? args.filters?.status ?? [
              PostStatusOptions.Published,
              PostStatusOptions.Draft,
            ]
          : [PostStatusOptions.Published],
      },
      //@todo - remove slug
      slug: args.filters?.slug,
      type: args.filters?.type ?? PostTypes.Post,
      tags: getTags({
        slug: args.filters.tagSlug,
        isPage,
        loggedIn: !!session,
      }),
      page_type: args.filters.page_type,
    },
    take: args.filters?.limit || 100,
    skip,
    orderBy: {
      updatedAt: args?.filters?.sortBy || "desc",
    },
    select: {
      id: true,
    },
  };
  try {
    const postIds = await prisma.post.findMany(condition);
    const posts = await context.dataloaders.post.loadMany(
      postIds.map((p) => p.id)
    );
    return {
      __typename: "PostsNode",
      rows: posts.map(mapPostToGraphql),
      count: await prisma.post.count({ where: condition.where }),
    };
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {
      __typename: "Exception",
      message: "Internal Server Error",
    };
  }
});

async function getTagSlugOfFirstMenuItemIfPossible(
  prisma: PrismaClient,
  author_id: number,
  { dataloaders }: ResolverContext
) {
  const author = await dataloaders.author.load(author_id);
  const settings = await dataloaders.setting.load(author_id);
  const authorWithSetting = {
    ...author,
    setting: settings,
  };

  // const authorWithSetting = await prisma.author.findFirst({
  //   where: { id: author_id },
  //   include: { setting: true },
  // });
  if (authorWithSetting?.setting?.menu) {
    const menu = JSON.parse(authorWithSetting?.setting.menu);
    if (menu[0].type === NavigationType.Tag) {
      return getLastPartFromPath(menu[0].slug);
    }
  }
}

function getTags({
  slug,
  loggedIn,
  isPage,
}: {
  isPage: boolean;
  slug?: string;
  loggedIn: boolean;
}) {
  if (isPage) return { every: {} };
  if (!loggedIn && !slug) return undefined;
  if (slug) {
    return {
      some: {
        slug,
      },
    };
  }
  return undefined;
}
