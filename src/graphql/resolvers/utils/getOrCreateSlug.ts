import { Prisma } from "@prisma/client";

import { getLastPartFromPath, textToSlug } from "@/utils/slug";

import { slugify } from "../helpers";

export async function getOrCreateSlug(
  postModel: Prisma.PostDelegate<false>,
  id: number,
  newSlug?: string | null,
  newTitle?: string,
) {
  const existingPost = await postModel.findFirst({ where: { id } });

  if (!existingPost) return "";
  // slug already exist for this post, but user updated the slug
  if (existingPost?.slug && newSlug) {
    newSlug = getLastPartFromPath(newSlug);
    newSlug = await slugify(
      postModel,
      textToSlug(newSlug),
      existingPost.author_id,
    );
    return newSlug;
  }

  // slug does not exist for existing post or contains default untitled slug.
  // If new title was entered, create a new slug
  if (
    newTitle &&
    (existingPost?.slug.startsWith("untitled") || !existingPost?.slug)
  ) {
    newSlug = await slugify(
      postModel,
      textToSlug(newTitle),
      existingPost.author_id,
    );
    return newSlug;
  }

  if (!existingPost.title && !newTitle && !newSlug) {
    newSlug = await slugify(postModel, "untitled", existingPost.author_id);
    return newSlug;
  }

  if (!newSlug) return existingPost?.slug;

  return textToSlug(newSlug);
}
