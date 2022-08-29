import {
  MutationUpdateMediaArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const updateMedia = async (
  args: MutationUpdateMediaArgs,
  { prisma, session }: ResolverContext,
): Promise<ResolversTypes["MediaUpdateResponse"]> => {
  if (!session?.user.id) {
    return {
      __typename: "MediaError",
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
