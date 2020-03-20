import logger from "../../../shared/logger";

export const statsResolver = async (root, args, { models }) => {
  logger.debug("Reached resolver: stats");
  const result = {
    posts: { published: 0, drafts: 0 },
    pages: { published: 0, drafts: 0 },
    tags: 0,
    categories: 0,
  };
  result.posts.published = await models.Post.count({
    where: { status: "publish", type: "post" },
  });

  result.posts.drafts = await models.Post.count({
    where: { status: "draft", type: "post" },
  });

  result.pages.published = await models.Post.count({
    where: { status: "publish", type: "page" },
  });

  result.pages.drafts = await models.Post.count({
    where: { status: "draft", type: "page" },
  });

  result.categories = await models.Taxonomy.count({
    where: { type: "post_category" },
  });
  result.tags = await models.Taxonomy.count({
    where: { type: "post_tag" },
  });

  return result;
};
