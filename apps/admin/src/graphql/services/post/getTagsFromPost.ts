import { ResolversParentTypes } from "@/__generated__/__types__";

export const getTagsFromPost = async (
  id: number,
  { prisma }
): Promise<ResolversParentTypes["TagsResponse"]> => {
  const tags = await prisma.tag.findMany({
    where: { posts: { some: { id } } },
  });

  const tagsWithSlug = tags
    .filter((tag) => typeof tag.slug === "string")
    .map((tag) => {
      return {
        ...tag,
        slug: tag.slug || "",
      };
    });
  return {
    __typename: "TagsNode",
    rows: tagsWithSlug,
  };
};
