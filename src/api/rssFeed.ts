import { PostsQuery, PostsQueryVariables } from "../__generated__/gqlTypes";

import { QUERY_POSTS } from "../shared/queries/Queries";
import RSS from "rss";
import { Response } from "express";
import apolloClient from "../shared/apolloClient";
import cache from "../client/server/cache";
import config from "../config/config.prod";
import { fetchSettings } from "./fetchSettings";
import logger from "../shared/logger";

const RssFeed = async (req, res: Response) => {
  if (!cache.get(req.url)) {
    const settings = await fetchSettings();
    const posts = await apolloClient().query<PostsQuery, PostsQueryVariables>({
      query: QUERY_POSTS,
      variables: {
        filters: {
          limit: 20,
        },
      },
    });
    const feed = new RSS({
      title: settings.site_title,
      description: settings.site_description,
      feed_url: config.ROOT_URL + config.BASE_NAME + "/rss.xml",
      site_url: config.ROOT_URL + config.BASE_NAME,
      image_url: settings.site_logo,
      language: "en",
      ttl: "60",
    });

    posts.data.posts.rows.forEach(post => {
      feed.item({
        title: post.title,
        description: post.excerpt,
        url: post.slug, // link to the item
        tags: post.tags.map(item => item.name), // optional - array of item categories
        author: post.author.fname + " " + post.author.lname, // optional - defaults to feed author property
        date: post.publishedAt, // any format that js Date can parse.
      });
    });
    const xml = feed.xml();
    res.set("Content-Type", "text/xml");
    logger.debug("setting xml");
    cache.set(req.url, xml);
  }
  const xml = cache.get(req.url);
  return res.send(xml);
};

export default RssFeed;
