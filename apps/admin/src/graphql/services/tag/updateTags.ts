import { MutationUpdateTagsArgs, UpdateTagsResponse } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";

export const updateTags = async (
  args: MutationUpdateTagsArgs,
  { session, prisma }: ResolverContext
): Promise<UpdateTagsResponse> => {
  if (!session?.user) {
    return {
      __typename: "UnAuthorized",
      message: "No session found",
    };
  }

  const author = await prisma.author.findFirst({
    where: { id: session.user.id },
  });

  if (!args.data || !author) {
    return {
      __typename: "UnAuthorized",
      message: "Incorrect arguments",
    };
  }

  const oldName = args.data.old_name || "";
  const newName = args.data.name.replace(/\s+/g, "-").toLowerCase();
  const newSlug = newName;

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
};
