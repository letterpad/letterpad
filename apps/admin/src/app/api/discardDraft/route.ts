import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { getServerSession } from "../../../graphql/context";

export async function POST(request: Request) {
  const session = await getServerSession({ req: request });
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const data = await request.json();

  const post = await prisma.post.findFirst({
    where: {
      id: data.id,
    },
  });

  if (!post) return new NextResponse("Post not found", { status: 404 });

  const updated = await prisma.post.update({
    data: {
      html_draft: post.html,
    },
    where: {
      id: data.id,
    },
  });

  return new NextResponse(JSON.stringify(updated), { status: 200 });
}
