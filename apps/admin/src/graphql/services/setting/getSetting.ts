import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";
import { mapSettingToGraphql } from "@/graphql/resolvers/mapper";

export const getSetting = async (
  _args: unknown,
  { session, client_author_id, prisma }: ResolverContext
): Promise<ResolversTypes["SettingResponse"]> => {
  const authorId = session?.user.id || client_author_id;

  if (authorId) {
    const author = await prisma.author.findFirst({
      where: { id: authorId },
      include: {
        setting: true,
      },
    });

    if (author && author.setting) {
      return { ...mapSettingToGraphql(author.setting) };
    }
  }

  return {
    __typename: "UnAuthorized",
    message: `Setting related to author:${authorId} not found`,
  };
};
