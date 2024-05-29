import { Prisma } from "@prisma/client";
import {
  InputMaybe,
  PostsResponse,
  PostStatusOptions,
  QueryRelatedPostsArgs,
} from "letterpad-graphql";
import { cache } from "react";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

import { TOPIC_PREFIX } from "../../../shared/utils";

export const getRelatedPosts = cache(
  async (
    args: QueryRelatedPostsArgs,
    context: ResolverContext
  ): Promise<PostsResponse> => {
    const { prisma, client_author_id } = context;

    const post = await prisma.post.findFirst({
      where: {
        id: args.filters?.post_id
      },
      include: {
        tags: true
      }
    });
    const topic = post?.tags.find((tag) => tag.slug?.startsWith(TOPIC_PREFIX))?.name ?? post?.tags[0]?.name;
    const condition: Partial<Prisma.PostFindManyArgs> = {
      where: {
        html: {},
        tags: {
          some: {
            name: topic
          }
        },
        id: {
          not: args.filters?.post_id
        },
        author_id: client_author_id ?? undefined,
        status: PostStatusOptions.Published
      },
      take: 10,
      orderBy: {
        publishedAt: "desc"
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
