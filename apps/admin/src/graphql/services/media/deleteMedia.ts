import {
  MutationDeleteMediaArgs,
  ResolversTypes,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const deleteMedia = async (
  args: MutationDeleteMediaArgs,
  { prisma, session }: ResolverContext
): Promise<ResolversTypes["MediaDeleteResponse"]> => {
  if (!session?.user) {
    return {
      __typename: "MediaError",
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
