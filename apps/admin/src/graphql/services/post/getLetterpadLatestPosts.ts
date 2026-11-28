import { Prisma } from "@prisma/client";
import { MapResult } from "graphql-fields-list";
import {
  PostsResponse,
  QueryLetterpadLatestPostsArgs,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
import { TOPIC_PREFIX } from "@/shared/utils";

import { getMatchingFields } from "../../utils/getMatchingFields";
import { discoveryEligibilityWhere } from "./discoveryEligibility";

export const getLetterpadLatestPosts = async (
  args: Partial<QueryLetterpadLatestPostsArgs>,
  { prisma, dataloaders }: ResolverContext,
  fields: MapResult
): Promise<PostsResponse> => {
  const cursor = args.filters?.cursor
    ? {
        cursor: {
          id: args.filters.cursor,
        },
      }
    : {};

  const tag = args.filters?.tag;
  const tags = tag
    ? {
        tags: {
          some: {
            OR: [
              { name: tag },
              { slug: tag },
              ...(tag.startsWith(TOPIC_PREFIX)
                ? [{ slug: tag.slice(TOPIC_PREFIX.length).toLowerCase() }]
                : []),
            ],
          },
        },
      }
    : {};

  const condition: Prisma.PostFindManyArgs = {
    where: {
      ...tags,
      ...discoveryEligibilityWhere,
    },
    skip: cursor.cursor ? 1 : 0,
    take: 13,
    ...cursor,
    orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
    select: {
      id: true,
    },
  };
  try {
    const postIds = await prisma.post.findMany(condition);
    const selections = getMatchingFields(fields.rows as MapResult);

    const postsPromise = dataloaders
      .post(selections)
      .loadMany(postIds.map((p) => p.id));
    const countPromise = prisma.post.count({ where: condition.where });
    const [posts, count] = await Promise.all([postsPromise, countPromise]);

    return {
      __typename: "PostsNode",
      rows: posts.map((p) => mapPostToGraphql(p)),
      count,
    };
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.log(e);
    return {
      __typename: "Exception",
      message: "Internal Server Error",
    };
  }
};
