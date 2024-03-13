import {
  MediaDeleteResponse,
  MutationDeleteMediaArgs,
} from "graphql-letterpad/dist/graphql";

import { ResolverContext } from "@/graphql/context";

export const deleteMedia = async (
  args: MutationDeleteMediaArgs,
  { prisma, session }: ResolverContext
): Promise<MediaDeleteResponse> => {
  if (!session?.user) {
    return {
      __typename: "UnAuthorized",
      message: "No Auhentication",
    };
  }

  await prisma.upload.deleteMany({
    where: {
      id: {
        in: args.ids,
      },
      author: {
        id: session.user.id,
      },
    },
  });

  return {
    __typename: "MediaDeleteResult",
    ok: true,
  };
};
