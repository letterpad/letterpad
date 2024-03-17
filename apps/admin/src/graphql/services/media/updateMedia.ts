import {
  MediaUpdateResponse,
  MutationUpdateMediaArgs,
} from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";

export const updateMedia = async (
  args: MutationUpdateMediaArgs,
  { prisma, session }: ResolverContext
): Promise<MediaUpdateResponse> => {
  if (!session?.user.id) {
    return {
      __typename: "UnAuthorized",
      message: "No Auhentication",
    };
  }

  await prisma.author.update({
    data: {
      uploads: {
        update: {
          data: args.data,
          where: {
            id: args.data.id,
          },
        },
      },
    },
    where: {
      id: session.user.id,
    },
  });
  return {
    __typename: "MediaUpdateResult",
    ok: true,
  };
};
