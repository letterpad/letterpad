import bcrypt from "bcryptjs";
import copydir from "copy-dir";
import generatePost from "./contentGenerator";
import mkdirp from "mkdirp";
import path from "path";
import posts from "./posts";
import { promisify } from "util";
import rimraf from "rimraf";

const mkdirpAsync = promisify(mkdirp);
const rimrafAsync = promisify(rimraf);
const copydirAsync = promisify(copydir);

// All paths are relative to this file
const dataDir = "../../../data";
const publicUploadsDir = "../../public/uploads";
const uploadsSourceDir = "./uploads";

function absPath(p) {
  return path.join(__dirname, p);
}

let models = null;
export const seed = async (dbModels, autoExit = true) => {
  models = dbModels;

  console.time("ensure data directories");
  await Promise.all([
    mkdirpAsync(absPath(dataDir)),
    mkdirpAsync(absPath(publicUploadsDir)),
  ]);
  console.timeEnd("ensure data directories");

  console.time("sync sequelize models");
  await models.sequelize.sync({ force: true });
  console.timeEnd("sync sequelize models");

  // do some clean first. delete the uploads folder
  console.time("sync uploads");
  await rimrafAsync(path.join(absPath(publicUploadsDir, "*")));
  await copydirAsync(absPath(uploadsSourceDir), absPath(publicUploadsDir));
  console.timeEnd("sync uploads");

  console.time("insert roles and permissions");
  await insertRolePermData(models);
  console.timeEnd("insert roles and permissions");

  console.time("insert authors and taxonomies");
  await Promise.all([insertAuthor(models), insertTaxonomy(models)]);

  console.timeEnd("insert authors and taxonomies");

  console.time("insert posts, settings, media");
  const [categories, tags] = await Promise.all([
    models.Taxonomy.findAll({
      where: { type: "post_category" },
    }),
    models.Taxonomy.findAll({
      where: { type: "post_tag" },
    }),
  ]);

  await Promise.all([
    ...posts.map(post => insertPost(post, models, categories, tags)),
    insertSettings(models),
    insertMedia(models),
  ]);
  console.timeEnd("insert posts, settings, media");
  if (autoExit) {
    process.exit(0);
  } else {
    return null;
  }
};

export async function insertRolePermData(models) {
  const [
    MANAGE_OWN_POSTS,
    READ_ONLY_POSTS,
    MANAGE_ALL_POSTS,
    MANAGE_USERS,
    MANAGE_SETTINGS,
  ] = await Promise.all([
    models.Permission.create({
      name: "MANAGE_OWN_POSTS",
    }),
    models.Permission.create({
      name: "READ_ONLY_POSTS",
    }),
    models.Permission.create({
      name: "MANAGE_ALL_POSTS",
    }),
    models.Permission.create({
      name: "MANAGE_USERS",
    }),
    models.Permission.create({
      name: "MANAGE_SETTINGS",
    }),
  ]);

  async function admin() {
    const role = await models.Role.create({ name: "ADMIN" });
    return Promise.all([
      role.addPermission(READ_ONLY_POSTS),
      role.addPermission(MANAGE_ALL_POSTS),
      role.addPermission(MANAGE_USERS),
      role.addPermission(MANAGE_SETTINGS),
      role.addPermission(MANAGE_OWN_POSTS),
    ]);
  }

  async function reviewer() {
    const role = await models.Role.create({ name: "REVIEWER" });
    return role.addPermission(MANAGE_ALL_POSTS);
  }

  async function reader() {
    const role = await models.Role.create({ name: "READER" });
    return role.addPermission(READ_ONLY_POSTS);
  }

  async function author() {
    const role = await models.Role.create({ name: "AUTHOR" });
    return role.addPermission(MANAGE_OWN_POSTS);
  }

  return Promise.all([admin(), reviewer(), reader(), author()]);
}

export async function insertAuthor(models) {
  return await models.Author.bulkCreate([
    {
      fname: "John",
      lname: "Dave",
      email: "demo@demo.com",
      password: bcrypt.hashSync("demo", 12),
      social: JSON.stringify({
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        github: "https://github.com",
        instagram: "https://instagram.com",
      }),
      RoleId: 1,
      bio:
        "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
      avatar: "/admin/images/avatar.png",
    },
    {
      fname: "Jim",
      lname: "Parker",
      email: "author@letterpad.app",
      password: bcrypt.hashSync("demo", 12),
      social: JSON.stringify({
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        github: "https://github.com",
        instagram: "https://instagram.com",
      }),
      RoleId: 1,
      bio:
        "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
      avatar: "/admin/images/avatar2.png",
    },
  ]);
}

export async function insertTaxonomy(models) {
  return models.Taxonomy.bulkCreate([
    {
      name: "Uncategorised",
      type: "post_category",
      slug: "uncategorised",
    },
    {
      name: "first-post",
      type: "post_tag",
      slug: "first-post",
    },
  ]);
}

export async function insertPost(params, models, categories, tags) {
  // get author  // 1 or 2
  const { md, html } = generatePost(params.type);
  let promises = [];
  const randomAuthorId = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
  let admin = await models.Author.findOne({ where: { id: randomAuthorId } });
  const title =
    params.type === "post" ? "Welcome to Letterpad" : "Letterpad Typography";
  const slug = title.toLocaleLowerCase().replace(/ /g, "-");

  let post = await models.Post.create({
    title,
    md: md,
    html: html,
    excerpt:
      "You can use this space to write a small description about the topic. This will be helpful in SEO.",
    cover_image: params.cover_image,
    authorId: randomAuthorId,
    type: params.type,
    status: params.status,
    slug: slug,
    createdAt: new Date(),
    publishedAt: new Date(),
  });

  promises = [admin.addPost(post)];
  if (params.type === "post") {
    promises = [
      ...promises,
      post.addTaxonomy(categories[0]),
      ...tags.map(tag => post.addTaxonomy(tag)),
    ];
  }
  return Promise.all(promises);
}

export async function insertMedia(models) {
  return models.Media.bulkCreate([
    {
      url: "/uploads/1.jpg",
      AuthorId: 1,
      name: "Blueberries",
      description:
        "Write a description about this image. You never know how this image can break the internet",
    },
    {
      url: "/uploads/2.jpg",
      AuthorId: 1,
      name: "I love the beach and its smell",
      description:
        "Write a description about this image. You never know how this image can break the internet",
    },
  ]);
}

export async function insertSettings(models) {
  let menu = JSON.stringify([
    {
      id: 1,
      title: "Uncategorised",
      type: "category",
      disabled: true,
      slug: "uncategorised",
    },
    {
      id: 11,
      title: "Letterpad Typography",
      slug: "letterpad-typography",
      type: "page",
      disabled: true,
    },
    {
      id: 111,
      title: "Not Found",
      slug: "404",
      type: "page",
      disabled: true,
    },
  ]);

  let data = [
    {
      option: "site_title",
      value: "Letterpad",
    },
    {
      option: "site_tagline",
      value: "Compose a story",
    },
    {
      option: "site_email",
      value: "admin@letterpad.app",
    },
    {
      option: "site_url",
      value: "https://letterpad.app/demo",
    },
    {
      option: "site_footer",
      value: "",
    },
    {
      option: "site_description",
      value: "",
    },
    {
      option: "subscribe_embed",
      value: "",
    },
    {
      option: "social_twitter",
      value: "https://twitter.com",
    },
    {
      option: "social_facebook",
      value: "https://facebook.com",
    },
    {
      option: "social_instagram",
      value: "https://instagram.com",
    },
    {
      option: "social_github",
      value: "https://www.github.com",
    },
    {
      option: "text_notfound",
      value: "Sorry, we went deep inside, but found nothing",
    },
    {
      option: "text_posts_empty",
      value: "Sorry, we couldn't find any posts",
    },
    {
      option: "displayAuthorInfo",
      value: true,
    },
    {
      option: "site_logo",
      value: "/uploads/logo.png",
    },
    {
      option: "site_favicon",
      value: "/uploads/logo.png",
    },
    {
      option: "menu",
      value: menu,
    },
    {
      option: "css",
      value: "",
    },
    {
      option: "google_analytics",
      value: "UA-120251616-1",
    },
    {
      option: "locale",
      value: JSON.stringify({ en: true, fr: false, pl: false }),
    },
    {
      option: "theme",
      value: "hugo",
    },
    {
      option: "disqus_id",
      value: "letterpad",
    },
    {
      option: "cloudinary_key",
      value: "",
    },
    {
      option: "cloudinary_name",
      value: "",
    },
    {
      option: "cloudinary_secret",
      value: "",
    },
    {
      option: "banner",
      value: JSON.stringify({
        src: "/uploads/banner.jpg",
        width: 1200,
        height: 700,
      }),
    },
  ];

  return models.Setting.bulkCreate(data);
}
