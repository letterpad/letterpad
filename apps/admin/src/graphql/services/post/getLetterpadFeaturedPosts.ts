import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"; // dependent on weekOfYear plugin
import weekYear from "dayjs/plugin/weekYear"; // dependent on weekOfYear plugin
import { MapResult } from "graphql-fields-list";
import { PostsResponse } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

import { getMatchingFields } from "../../utils/getMatchingFields";
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

export const getLetterpadFeaturedPosts = async (
  _args,
  { prisma, dataloaders }: ResolverContext,
  fields: MapResult
): Promise<PostsResponse> => {
  try {
    const postIds = await prisma.featuredWeek.findMany({
      where: {
        week_number: dayjs().week(),
      },
      include: {
        post: {
          select: {
            id: true,
          },
        },
      },
    });
    const selections = getMatchingFields(fields.rows as MapResult);
    const posts = await dataloaders
      .post(selections)
      .loadMany(postIds.map((p) => p.post_id));

    return {
      __typename: "PostsNode",
      rows: posts.map((p) => mapPostToGraphql(p)),
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
