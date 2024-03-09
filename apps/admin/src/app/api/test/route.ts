import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { v4 as uuidV4 } from 'uuid';

import { prisma } from "@/lib/prisma";
export async function GET() {
  const allAuthors = await prisma.author.findMany();
  const allPosts = await prisma.post.findMany();

  const authors = allAuthors.map(async (author) => {
    const authorId = uuidV4();
    const settingId = uuidV4();
    return await prisma.author.update({
      where: { id: author.id },
      data: {
        id: authorId,
        setting: {
          update: {
            id: settingId
          }
        },
      },
    });
  });

  const posts = allPosts.map(async (post) => {
    const postId = uuidV4();
    return await prisma.post.update({
      where: { id: post.id },
      data: {
        id: postId,

      },
    });
  });

  // revalidateTag("letterpadLatestPosts");
  // revalidateTag("newAuthors");
  // revalidateTag("featuredPosts");
  // revalidateTag("categories");
  // revalidateTag("resources");
  // revalidateTag("resource");
  // revalidateTag("announcement");
  return NextResponse.json({ authors, posts });
}
