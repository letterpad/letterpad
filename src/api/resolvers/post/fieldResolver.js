import Sequelize from "sequelize";

export const addConditionsPlaceholder = async (root, args) => {
  if (!args.filters.type) {
    args.filters.type = "post";
  }
  return {
    ...args.filters,
    conditions: { include: [], where: {}, limit: 20 },
  };
};

export const resolveMenuFilter = async (root, args, { models }) => {
  if (!args) return;
  if (args.tagSlug) {
    let { tagSlug } = args;
    if (tagSlug === "/") {
      // get the first menu item.
      const { value } = await models.Setting.findOne({
        attributes: ["value"],
        where: { option: "menu" },
        raw: true,
      });

      tagSlug = JSON.parse(value)[0].slug;
    }

    const taxTag = await models.Taxonomy.findOne({
      where: { slug: tagSlug, type: "post_tag" },
    });

    if (!taxTag) return null;

    args.conditions.include.push({
      model: models.PostTaxonomy,
      where: { taxonomy_id: taxTag.id },
      require: true,
    });
  }
  return args;
};

export const resolveTagFilter = async (root, args, { models }) => {
  if (!args) return;
  if (args.tag) {
    const taxTag = await models.Taxonomy.findOne({
      where: Sequelize.where(
        Sequelize.fn("lower", Sequelize.col("name")),
        Sequelize.fn("lower", args.tag),
      ),
    });
    if (!taxTag) return null;

    args.conditions.include.push({
      model: models.PostTaxonomy,
      where: { taxonomy_id: taxTag.id },
      require: true,
    });
  }

  return args;
};

export const resolveAuthor = async (root, args, { models }) => {
  if (!args) return;
  if (args.author) {
    const authorCondition = {
      where: {
        fname: { [Sequelize.Op.like]: "%" + author + "%" },
      },
    };
    const author = await models.Author.findOne(authorCondition);

    if (!author) {
      return null;
    }
    args.conditions.include.push({
      model: models.Author,
      where: { id: author.id },
      require: true,
    });
  }
  return args;
};

export const resolvePagination = async (root, args) => {
  if (!args) return;
  if (args.cursor) {
    args.conditions.where.id = { [Sequelize.Op.gt]: args.cursor };
  } else if (args.page) {
    args.conditions.offset = (args.page - 1) * args.conditions.limit;
  }
  if (args.limit) {
    args.conditions.limit = args.limit;
  }
  return args;
};

export const resolveStatusAndTypeAndFeatured = async (root, args) => {
  if (!args) return;
  if (args.featured) {
    args.conditions.where.featured = args.featured;
  }
  if (args.type) {
    args.conditions.where.type = args.type;
  }
  if (args.status) {
    args.conditions.where.status = args.status;
  } else {
    args.conditions.where.status = { [Sequelize.Op.ne]: "trash" };
  }
  return args;
};

export const resolveOrderAndSort = async (root, args, { user }) => {
  if (!args) return;
  args.conditions.order = [["updatedAt", "DESC"]];

  if (args.sortBy) {
    args.conditions.order = [
      ["publishedAt", args.sortBy === "oldest" ? "ASC" : "DESC"],
    ];
  }
  if (user && user.id) {
    args.conditions.order = [
      ["updatedAt", args.sortBy === "oldest" ? "ASC" : "DESC"],
    ];
  }

  return args;
};

export const resolveSearchTerm = async (root, args) => {
  if (!args) return;
  if (args.query) {
    args.conditions.where.title = {
      [Sequelize.Op.like]: "%" + args.query + "%",
    };
  }

  return args;
};

export const executePostCollectionQuery = async (root, args, { models }) => {
  if (!args) return;
  console.log("object :", args.conditions);
  const result = await models.Post.findAndCountAll(args.conditions);

  return {
    count: result.count,
    rows: result.rows,
  };
};
