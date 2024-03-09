import { prisma } from "@/lib/prisma";

import { getLastPartFromPath, textToSlug } from "@/utils/slug";

import { slugify } from "../helpers";

export async function getOrCreateSlug(
  id: string,
  newSlug?: string | null,
  newTitle?: string
) {
  const existingPost = await prisma.post.findFirst({ where: { id } });

  if (!existingPost) return "";
  // slug already exist for this post, but user updated the slug
  if (existingPost?.slug && newSlug) {
    newSlug = getLastPartFromPath(newSlug);
    newSlug = await slugify(
      textToSlug(newSlug),
      existingPost.author_id,
      existingPost.id
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
      textToSlug(newTitle),
      existingPost.author_id,
      existingPost.id
    );
    return newSlug;
  }

  if (!existingPost.title && !newTitle && !newSlug) {
    newSlug = await slugify("untitled", existingPost.author_id, existingPost.id);
    return newSlug;
  }

  if (!newSlug) return existingPost?.slug;

  return textToSlug(newSlug);
}
