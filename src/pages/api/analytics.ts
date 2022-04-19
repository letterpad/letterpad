import { SessionData } from "@/graphql/types";
import { umamiApi } from "@/lib/umami";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "@/lib/prisma";

const Analytics = async (req: NextApiRequest, res: NextApiResponse) => {
  const _session = await getSession({ req });
  const session = _session as unknown as { user: SessionData };
  if (!session || !session.user.id) return res.status(401).send("Unauthorized");

  const { websiteId, days = 7 } = req.query;

  const api = await umamiApi(Number(websiteId));

  const urlView = await getUrlView({ api, days, user_id: session.user.id });

  const stats = await api.getStats();
  res.json({ urlView, stats });
};

export default Analytics;

async function getUrlView({ api, days, user_id }) {
  if (Number(days) == 0) {
    api.today();
  } else if (Number(days) == 1) {
    api.yesterday();
  } else {
    api.setTimerange(days);
  }
  const result = await api.getUrls();
  //@ts-ignore
  const slugs = result.map((item) => item["x"].split("/").pop());
  const dbPosts = await prisma.post.findMany({
    where: {
      slug: {
        in: [...slugs],
      },
      author: {
        id: user_id,
      },
    },
    select: {
      title: true,
      type: true,
      slug: true,
    },
  });
  const urlMap = {
    "/about": { title: "About", type: "page", slug: "/about" },
    "/tags": { title: "Tags", type: "page", slug: "/tags" },
    "/": { title: "Home", type: "-", slug: "/" },
  };
  dbPosts.forEach((item) => {
    urlMap[`/${item.type}/${item.slug}`] = item;
  });
  //@ts-ignore
  const urlViews = result.map((r) => {
    if (!urlMap[r.x]) {
      //   return { ...r, title: r.x + " (title not found) ", type: "-" };
      return { ...r, title: r.x, type: "-" };
    }
    return { ...r, ...urlMap[r.x] };
  });

  return urlViews;
}
