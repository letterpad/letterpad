import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getAuthorFromPost = async (
  id: number,
  { dataloaders }: ResolverContext
): Promise<ResolversTypes["AuthorResponse"]> => {

  const author = await dataloaders.author.load(id);
  if (author) {
    return {
      __typename: "Author",
      ...author,
      createdAt: author.createdAt?.toISOString() || undefined,
      signature: author.signature || undefined,
      register_step: author.register_step as ResolversTypes["RegisterStep"],
      analytics_id: author.analytics_id || undefined,
      analytics_uuid: author.analytics_uuid || undefined,
      social: JSON.parse(author.social),
    };
  }
  return {
    __typename: "NotFound",
    message: `Author of post ${id} was not found`,
  };
};
