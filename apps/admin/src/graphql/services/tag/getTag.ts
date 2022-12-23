import { QueryTagArgs, ResolversTypes, Tag } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

export const getTag = async (
  args: QueryTagArgs,
  { session, client_author_id, prisma }: ResolverContext
): Promise<ResolversTypes["TagResponse"]> => {
  const authorId = session?.user.id || client_author_id;

  if (!authorId) {
    return {
      __typename: "Exception",
      message: "You dont have access to get this resource",
    };
  }

  const tag = await prisma.tag.findFirst({
    where: { slug: args.slug },
  });

  if (tag) {
    return {
      __typename: "Tag",
      ...(tag as Tag),
    };
  }
  return {
    __typename: "Exception",
    message: "Tag not found",
  };
};
