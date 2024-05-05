import { Prisma } from "@prisma/client";
import {
  InputMaybe,
  PostsResponse,
  PostStatusOptions,
  PostTypes,
  QueryPostsArgs,
} from "letterpad-graphql";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { isSqliteDb } from "@/utils/utils";

export const getPosts = cache(
  async (
    args: QueryPostsArgs,
    context: ResolverContext
  ): Promise<PostsResponse> => {
    const { session, client_author_id, prisma } = context;
    const session_author_id = session?.user.id;
    const authorId = session_author_id || client_author_id || undefined;

    if (!args.filters) {
      args.filters = {};
    }

    // if there is no session, do not show draft or deleted items.
    if (!session_author_id) {
      args.filters.status = [PostStatusOptions.Published];
    }

    const { page = 1, limit = 10 } = args.filters;
    const skip = page && limit ? (page - 1) * limit : 0;
    const isPage = args.filters.type === PostTypes.Page;
    const condition: Partial<Prisma.PostFindManyArgs> = {
      where: {
        html: {},
        banned: args.filters.banned,
        author_id: authorId,
        exclude_from_home: undefined,
        featured: args.filters?.featured,
        status: getStatus(session?.user.id, args.filters?.status),
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
        updatedAt: session?.user ? args?.filters?.sortBy || "desc" : undefined,
        publishedAt: !session?.user
          ? args?.filters?.sortBy || "desc"
          : undefined,
      },
      select: {
        id: true,
      },
    };

    if (condition.where && args.filters.tagSlug === "/") {
      condition.where.exclude_from_home = false;
      condition.where.tags = undefined;
    }
    // sqlite does not suppost search but mysql does
    if (!isSqliteDb() && condition.where?.html) {
      condition.where.html.search = args.filters?.search
        ?.replace(/\s\s+/g, " ")
        .replaceAll(/ /g, " & ");
    } else if (condition.where?.html) {
      condition.where.html["contains"] = args.filters?.search;
    }
    try {
      const postIds = await prisma.post.findMany(condition);
      const posts = await context.dataloaders.post.loadMany(
        postIds.map((p) => p.id)
      );

      return {
        __typename: "PostsNode",
        rows: posts.map(p => mapPostToGraphql(p)),
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
  }
);

interface GetTagsProps {
  isPage: boolean;
  slug?: string;
  loggedIn: boolean;
}

function getTags({ slug, loggedIn, isPage }: GetTagsProps) {
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

function getStatus(session, status?: InputMaybe<PostStatusOptions>[]) {
  return {
    in: session
      ? status ?? [PostStatusOptions.Published, PostStatusOptions.Draft]
      : [PostStatusOptions.Published],
  };
}
