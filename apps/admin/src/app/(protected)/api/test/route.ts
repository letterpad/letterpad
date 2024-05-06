import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateTag("letterpadLatestPosts");
  revalidateTag("newAuthors");
  revalidateTag("featuredPosts");
  revalidateTag("categories");
  revalidateTag("resources");
  revalidateTag("resource");
  revalidateTag("announcement");
  revalidateTag("trendingPosts");
  return NextResponse.json({});
}
