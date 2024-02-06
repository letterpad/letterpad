import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { delAllPageViews, getAllPageViews } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const views = await getAllPageViews();

  const dbUpdateViewPromsies = views.map(({ key, count }) => {
    if (key.includes("home")) {
      const author_id = Number(key.replace(/[^0-9]/g, ""));
      return prisma.pageViews.upsert({
        where: {
          author_id_view_type: {
            author_id,
            view_type: "home",
          },
        },
        update: { count },
        create: {
          view_type: "home",
          count,
          author: {
            connect: {
              id: author_id,
            },
          },
        },
      });
    } else if (key.includes("profile")) {
      const author_id = Number(key.replace(/[^0-9]/g, ""));
      return prisma.pageViews.upsert({
        where: {
          author_id_view_type: {
            author_id,
            view_type: "profile",
          },
        },
        update: { count },
        create: {
          view_type: "profile",
          count,
          author: {
            connect: {
              id: author_id,
            },
          },
        },
      });
    } else if (key.includes("post")) {
      const post_id = Number(key.replace(/[^0-9]/g, ""));
      return prisma.pageViews.upsert({
        where: {
          post_id_view_type: {
            post_id,
            view_type: "post",
          },
        },
        update: { count },
        create: {
          view_type: "post",
          count,
          post: {
            connect: {
              id: post_id,
            },
          },
        },
      });
    }
    return Promise.resolve();
  });

  await Promise.all(dbUpdateViewPromsies);
  await delAllPageViews(...views.map((v) => v.key));

  return Response.json({ success: true });
}
