import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  revalidateTag("letterpadLatestPosts");
  revalidateTag("newAuthors");
  revalidateTag("featuredPosts");
  return NextResponse.json({});
}
