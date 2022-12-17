import { ResolverContext } from "@/graphql/context";
import { prisma } from "@/lib/prisma";
import { PostStatusOptions, QueryResolvers } from "@/__generated__/__types__";

const Query: QueryResolvers<ResolverContext> = {
  feed: async (_root, _args, { client_author_id, prisma, session }) => {
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
        publishedAt: true,
        title: true,
        slug: true,
        type: true,
        excerpt: true,
        author: {
          select: {
            name: true,
          },
        },
        tags: {
          select: {
            name: true,
          },
        },
      },
      where: { author: { id }, status: PostStatusOptions.Published },
      orderBy: { updatedAt: "desc" },
    });

    const rows = posts.map((post) => ({
      guid: `${siteUrl}/${post.type}/${post.slug}`,
      link: `${siteUrl}/${post.type}/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      pubDate: new Date(
        post.publishedAt || post.updatedAt || new Date(),
      ).toISOString(),
      author: `${setting?.site_email} (${post?.author?.name})`,
      categories: post.tags.map((tag) => tag.name),
    }));

    return { message: "", rows, __typename: "Feed" };
  },
  sitemaps: async (_root, _args) => {
    const subdomains = await prisma.author.findMany({
      select: {
        username: true,
        last_seen: true,
      },
    });
    const rows = subdomains
      .filter(({ username }) => isValidUrl(`https://${username}.letterpad.app`))
      .map(({ username, last_seen }) => {
        return {
          route: `https://${username}.letterpad.app/sitemap.xml`,
          lastmod: last_seen
            ? new Date(last_seen).toISOString()
            : new Date().toISOString(),
          priority: 1,
          changefreq: "daily",
        };
      });
    return { message: "", rows, __typename: "SiteMapList" };
  },
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

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i",
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};
