import { Prisma } from "@prisma/client";

import { QueryMediaArgs, ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getMedia = async (
  args: QueryMediaArgs,
  { prisma, session }: ResolverContext
): Promise<ResolversTypes["MediaResponse"]> => {
  if (!session?.user.id) {
    return {
      __typename: "UnAuthorized",
      message: "",
    };
  }

  const { id, cursor, limit = 20, page = 1 } = args.filters ?? {};

  const condition: Prisma.UploadFindManyArgs = {
    where: {
      author: {
        id: session.user.id,
      },
    },
    take: limit,

    cursor: cursor
      ? {
          id: cursor,
        }
      : undefined,
    skip: (page - 1) * limit,
  };

  const result = await prisma.upload.findMany(condition);

  return {
    __typename: "MediaNode",
    rows: result,
    count: await prisma.upload.count({
      where: { id, author: { id: session.user.id } },
    }),
  };
};
