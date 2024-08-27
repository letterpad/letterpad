import dayjs from "dayjs";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { createAnalyticsDataClient } from "../../../analytics/route";

const MAX_ROW_LIMIT = 20;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", {
  //     status: 401,
  //   });
  // }
  const today = dayjs();
  const startDate = today.subtract(14, "day").format("YYYY-MM-DD");
  const endDate = today.format("YYYY-MM-DD");

  const response = await createAnalyticsDataClient()
    .runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        {
          name: "pageLocation",
        },
      ],
      metrics: [
        {
          name: "engagedSessions",
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "BEGINS_WITH",
            value: "/post/",
          },
        },
      },
      limit: 10,
    })
    // eslint-disable-next-line no-console
    .catch(console.log);

  const data = response[0]?.rows?.map((row: any) => {
    const site = row.dimensionValues[0].value.split("/")[2];
    const slug = row.dimensionValues[0].value.split("/")[4];
    const isDomainMapped = site.includes("letterpad.app") ? false : true;
    const username = site.includes("letterpad.app") ? site.split(".")[0] : null;
    const domainName = site.includes("letterpad.app") ? null : site;

    if (isDomainMapped) {
      return prisma.post.findFirst({
        where: {
          slug: slug,
          author: {
            domain: {
              name: domainName,
            },
          },
        },
        select: {
          id: true,
        },
      });
    }
    return prisma.post.findFirst({
      where: {
        slug: slug,
        author: {
          username: username,
        },
      },
      select: {
        id: true,
      },
    });
  });
  const trendingPosts = await Promise.all(data);

  const trendingViews = response[0]?.rows?.map((row: any) => {
    return Number(row.metricValues[0].value);
  });

  const trendingPostsData = trendingPosts.map((post, index) => {
    return {
      post_id: post?.id,
      views: trendingViews[index],
    };
  });

  await prisma.trending.createMany({
    data: trendingPostsData.filter((item) => item.post_id),
  });

  const count = await prisma.trending.count();

  if (count >= MAX_ROW_LIMIT) {
    const idsToDelete = await prisma.trending.findMany({
      orderBy: {
        updatedAt: "asc",
      },
      select: {
        id: true,
      },
      take: count - MAX_ROW_LIMIT,
      skip: 0,
    });
    await prisma.trending.deleteMany({
      where: {
        id: {
          in: idsToDelete.map((item) => item.id),
        },
      },
    });
  }

  revalidateTag("trendingPosts");
  return NextResponse.json({ success: true });
}
