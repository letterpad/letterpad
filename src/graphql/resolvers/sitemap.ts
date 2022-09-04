import { PostStatusOptions, QueryResolvers } from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

const Query: QueryResolvers<ResolverContext> = {
  sitemap: async (_root, _args, { client_author_id, prisma, session }) => {
    const id = client_author_id || session?.user.id;
    if (!id) return { message: "Author Id not found", rows: [] };
    const setting = await prisma.setting.findFirst({
      where: { author: { id } },
    });
    if (!setting) return { message: "Author not found", rows: [] };

    const siteUrl = setting?.site_url;
    const posts = await prisma.post.findMany({
      select: {
        updatedAt: true,
        title: true,
        slug: true,
        type: true,
      },
      where: { author: { id }, status: PostStatusOptions.Published },
      orderBy: { updatedAt: "desc" },
    });

    const rows = posts.map((post) => ({
      route: `${siteUrl}/${post.type}/${post.slug}`,
      lastmod: new Date(post.updatedAt || "").toISOString(),
      priority: 1,
      changefreq: "daily",
    }));

    if (setting.show_about_page) {
      rows.push({
        route: `${siteUrl}/about`,
        lastmod: new Date().toISOString(),
        priority: 1,
        changefreq: "yearly",
      });
    }
    if (setting.show_tags_page) {
      rows.push({
        route: `${siteUrl}/tags`,
        lastmod: new Date().toISOString(),
        priority: 1,
        changefreq: "monthly",
      });
    }
    rows.push({
      route: `${siteUrl}`,
      lastmod: new Date().toISOString(),
      priority: 1,
      changefreq: "monthly",
    });

    return { message: "", rows, __typename: "SiteMapList" };
  },
};
export default { Query };
