import { TagsResponse, TagType } from "letterpad-graphql";

import { ResolverContext } from "../../context";

export const getTagsFromPost = async (
  id: string,
  { dataloaders }: ResolverContext
): Promise<TagsResponse> => {
  const tags = await dataloaders.tagsByPostId.load(id);
  const tagsWithSlug = tags
    .filter((tag) => typeof tag.slug === "string")
    .map((tag) => {
      return {
        ...tag,
        id: tag.name,
        type: TagType.Tag,
        slug: tag.slug || "",
      };
    });
  return {
    __typename: "TagsNode",
    rows: tagsWithSlug,
  };
};
