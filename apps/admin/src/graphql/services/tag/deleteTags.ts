import {
  MutationDeleteTagsArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const deleteTags = async (
  args: MutationDeleteTagsArgs,
  { session, prisma }: ResolverContext
): Promise<ResolversTypes["DeleteTagsResponse"]> => {
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
};
