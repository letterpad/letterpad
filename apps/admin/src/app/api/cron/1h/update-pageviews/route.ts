import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { delAllPageViews, getAllPageViews, getKeyForViews } from "@/lib/redis";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const views = await getAllPageViews();
  const viewsObject = views.reduce(
    (acc, { key, count }) => {
      acc[key] = count;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const where = views.map(({ key }) => {
    const id = Number(key.replace(/[^0-9]/g, ""));
    const item = {};

    if (key.includes("home")) {
      item["author_id"] = id;
      item["view_type"] = "home";
    }

    if (key.includes("profile")) {
      item["author_id"] = id;
      item["view_type"] = "profile";
    }

    if (key.includes("post")) {
      item["post_id"] = id;
      item["view_type"] = "post";
    }
    return item;
  });

  const prevCountsDb = await prisma.pageViews.findMany({
    select: {
      author_id: true,
      post_id: true,
      view_type: true,
      count: true,
    },
    where: {
      OR: where,
    },
  });

  const prevCountsObjectDb = prevCountsDb.reduce(
    (acc, { author_id, post_id, view_type, count }) => {
      if (author_id) {
        acc[getKeyForViews(view_type, author_id)] = count;
      }
      if (post_id) {
        acc[getKeyForViews(view_type, post_id)] = count;
      }
      return acc;
    },
    {} as { [key: string]: number }
  );

  const dbUpdateViewPromsies = Object.keys(viewsObject).map((key) => {
    const count = viewsObject[key];
    const updateCount = (prevCountsObjectDb[key] ?? 0) + count;
    if (key.includes("home")) {
      const author_id = Number(key.replace(/[^0-9]/g, ""));
      return prisma.pageViews
        .upsert({
          where: {
            author_id_view_type: {
              author_id,
              view_type: "home",
            },
          },
          update: { count: updateCount },
          create: {
            view_type: "home",
            count,
            author: {
              connect: {
                id: author_id,
              },
            },
          },
        })
        .catch((_e) => {
          // eslint-disable-next-line no-console
          console.log(`pageView home error for author_id: ${author_id}`);
        });
    } else if (key.includes("profile")) {
      const author_id = Number(key.replace(/[^0-9]/g, ""));
      return prisma.pageViews
        .upsert({
          where: {
            author_id_view_type: {
              author_id,
              view_type: "profile",
            },
          },
          update: { count: updateCount },
          create: {
            view_type: "profile",
            count,
            author: {
              connect: {
                id: author_id,
              },
            },
          },
        })
        .catch((_e) => {
          // eslint-disable-next-line no-console
          console.log(`pageView profile error for author_id: ${author_id}`);
        });
    } else if (key.includes("post")) {
      const post_id = Number(key.replace(/[^0-9]/g, ""));
      return prisma.pageViews
        .upsert({
          where: {
            post_id_view_type: {
              post_id,
              view_type: "post",
            },
          },
          update: { count: updateCount },
          create: {
            view_type: "post",
            count,
            post: {
              connect: {
                id: post_id,
              },
            },
          },
        })
        .catch((_e) => {
          // eslint-disable-next-line no-console
          console.log(`pageView post error for post_id: ${post_id}`);
        });
    }
    return Promise.resolve();
  });

  await Promise.all(dbUpdateViewPromsies);
  if (views.length > 0) {
    await delAllPageViews(...views.map((v) => v.key));
  }
  return Response.json({ success: true });
}
