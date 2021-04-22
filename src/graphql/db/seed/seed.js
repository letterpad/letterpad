import bcrypt from "bcryptjs";
// import copydir from "copy-dir";
import generatePost from "./contentGenerator";
// import mkdirp from "mkdirp";
import path from "path";
import posts from "./posts";
// import { promisify } from "util";
// import rimraf from "rimraf";

// const mkdirpAsync = promisify(mkdirp);
// const rimrafAsync = promisify(rimraf);
// const copydirAsync = promisify(copydir);

// // All paths are relative to this file
// const dataDir = "../../../data";
// const publicUploadsDir = "../../public/uploads";
// const uploadsSourceDir = "./uploads";

function absPath(p) {
  return path.join(__dirname, p);
}

let models = null;
export const seed = async (dbModels, autoExit = true) => {
  models = dbModels;

  //   console.time("ensure data directories");
  //   await Promise.all([
  //     mkdirpAsync(absPath(dataDir)),
  //     mkdirpAsync(absPath(publicUploadsDir)),
  //   ]);
  //   console.timeEnd("ensure data directories");

  console.time("sync sequelize models");
  await models.sequelize.sync({ force: true });
  console.timeEnd("sync sequelize models");

  // do some clean first. delete the uploads folder
  //   console.time("sync uploads");
  //   await rimrafAsync(path.join(absPath(publicUploadsDir, "*")));
  //   await copydirAsync(absPath(uploadsSourceDir), absPath(publicUploadsDir));
  //   console.timeEnd("sync uploads");

  console.time("insert roles and permissions");
  await insertRolePermData(models);
  console.timeEnd("insert roles and permissions");

  console.time("insert authors and Tags");
  await Promise.all([insertAuthor(models), insertTags(models)]);
  console.timeEnd("insert authors and Tags");

  console.time("Asssign Role to author");
  const role = await models.Role.findOne({ where: { id: 1 } });
  const authors = await models.Author.findAll();
  authors.map(async author => {
    await author.setRole(role);
  });
  console.timeEnd("Asssign Role to author");

  console.time("insert posts, settings, media");
  const [tags] = await Promise.all([
    models.Tags.findAll({
      where: { type: "post_tag" },
    }),
  ]);

  await Promise.all([
    ...posts.map(post => insertPost(post, models, tags)),
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
      name: "John",
      email: "demo@demo.com",
      password: "123", //bcrypt.hashSync("demo", 12),
      social: JSON.stringify({
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        github: "https://github.com",
        instagram: "https://instagram.com",
      }),
      bio:
        "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
      avatar:
        "https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
    },
    {
      name: "Jim Parker",
      email: "author@letterpad.app",
      password: bcrypt.hashSync("demo", 12),
      social: JSON.stringify({
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        github: "https://github.com",
        instagram: "https://instagram.com",
      }),
      bio:
        "Provident quis sed perferendis sed. Sed quo nam eum. Est quos beatae magnam ipsa ut cupiditate nostrum officiis. Vel hic sit voluptatem. Minus minima quis omnis.",
      avatar:
        "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
    },
  ]);
}

export async function insertTags(models) {
  return models.Tags.bulkCreate([
    {
      name: "Home",
      type: "post_tag",
      slug: "home",
    },
    {
      name: "first-post",
      type: "post_tag",
      slug: "first-post",
    },
  ]);
}

export async function insertPost(params, models, tags) {
  // get author  // 1 or 2
  const { md, html } = generatePost(params.type);
  let promises = [];
  const randomAuthorId = 1; //Math.floor(Math.random() * (2 - 1 + 1)) + 1;
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
    reading_time: "5 mins",
  });

  promises = [admin.addPost(post)];
  if (params.type === "post") {
    promises = [...promises, ...tags.map(tag => post.addTags(tag))];
  }
  return Promise.all(promises);
}

export async function insertMedia(models) {
  return models.Media.bulkCreate([
    {
      url:
        "https://images.unsplash.com/photo-1473181488821-2d23949a045a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
      AuthorId: 1,
      name: "Blueberries",
      width: 1350,
      height: 900,
      description:
        "Write a description about this image. You never know how this image can break the internet",
    },
    {
      url:
        "https://images.unsplash.com/photo-1524654458049-e36be0721fa2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
      AuthorId: 1,
      width: 1350,
      height: 900,
      name: "I love the beach and its smell",
      description:
        "Write a description about this image. You never know how this image can break the internet",
    },
  ]);
}

export async function insertSettings(models) {
  const menu = [
    {
      label: "home",
      original_name: "home",
      slug: "home",
      type: "tag",
    },
    {
      label: "Letterpad Typography",
      original_name: "Letterpad Typography",
      slug: "letterpad-typography",
      type: "page",
    },
  ];
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
      option: "displayAuthorInfo",
      value: true,
    },
    {
      option: "site_logo",
      value: JSON.stringify({
        src: "/uploads/logo.png",
        width: 200,
        height: 200,
      }),
    },
    {
      option: "site_favicon",
      value: JSON.stringify({
        src: "/uploads/logo.png",
        width: 200,
        height: 200,
      }),
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
      option: "menu",
      value: JSON.stringify(menu),
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
        src:
          "https://images.unsplash.com/photo-1435224668334-0f82ec57b605?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
        width: 1502,
        height: 900,
      }),
    },
  ];

  return models.Setting.bulkCreate(data);
}
