import { AuthorResponse, RegisterStep } from "letterpad-graphql";

import { ResolverContext } from "@/graphql/context";

export const getAuthorFromPost = async (
  id: string,
  { dataloaders }: ResolverContext
): Promise<AuthorResponse> => {

  const author = await dataloaders.author.load(id);
  if (author) {
    return {
      __typename: "Author",
      ...author,
      createdAt: author.createdAt?.toISOString() || undefined,
      signature: author.signature || undefined,
      register_step: author.register_step as RegisterStep,
      social: JSON.parse(author.social),
    };
  }
  return {
    __typename: "NotFound",
    message: `Author of post ${id} was not found`,
  };
};
