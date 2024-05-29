import dayjs from "dayjs";
import weekOfYear from 'dayjs/plugin/weekOfYear' // dependent on weekOfYear plugin
import weekYear from 'dayjs/plugin/weekYear' // dependent on weekOfYear plugin
import {
  PostsResponse,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

export const getLetterpadFeaturedPosts = async (
  _args,
  { prisma, dataloaders }: ResolverContext
): Promise<PostsResponse> => {
  try {
    const postIds = await prisma.featuredWeek.findMany({
      where: {
        week_number: dayjs().week(),
      },
      include: {
        post: {
          select: {
            id: true
          }
        }
      }
    });
    const posts = await dataloaders.post.loadMany(
      postIds.map((p) => p.post_id)
    );

    return {
      __typename: "PostsNode",
      rows: posts.map(p => mapPostToGraphql(p)),
      count: posts.length,
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