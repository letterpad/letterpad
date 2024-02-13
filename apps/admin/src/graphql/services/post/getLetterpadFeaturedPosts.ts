import {
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapPostToGraphql } from "@/graphql/resolvers/mapper";

export const getLetterpadFeaturedPosts = async (
  _args,
  { prisma }: ResolverContext
): Promise<ResolversTypes["PostsResponse"]> => {
  try {
    const posts = await prisma.featuredWeek.findMany({
      where: {
        week_number: getWeekNumber(),
      },
      include: {
        post: true
      }
    });
    return {
      __typename: "PostsNode",
      rows: posts
        .map(p => mapPostToGraphql(p.post)),
      count: posts.length
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


const getWeekNumber = (): number => {
  const now: Date = new Date();
  const startOfYear: Date = new Date(now.getFullYear(), 0, 0);
  const difference: number = now.getTime() - startOfYear.getTime();
  const oneWeek: number = 1000 * 60 * 60 * 24 * 7;
  const weekNumber: number = Math.floor(difference / oneWeek);

  return weekNumber;
};