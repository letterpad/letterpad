import { ResolversTypes } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getAuthorFromPost = async (
  id: number,
  { prisma, dataloaders }: ResolverContext
): Promise<ResolversTypes["AuthorResponse"]> => {
  // const post = await prisma.post.findFirst({
  //   where: { id },
  //   include: { author: true },
  // });

  const author = await dataloaders.author.load(id);
  if (author) {
    return {
      __typename: "Author",
      ...author,
      register_step: author.register_step as ResolversTypes["RegisterStep"],
      analytics_id: author.analytics_id || undefined,
      analytics_uuid: author.analytics_uuid || undefined,
      stripe_customer_id: author.stripe_customer_id || undefined,
      stripe_subscription_id: author.stripe_subscription_id || undefined,
      social: JSON.parse(author.social),
    };
  }
  return {
    __typename: "NotFound",
    message: `Author of post ${id} was not found`,
  };
};
