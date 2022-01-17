import connection, { models } from "../models/index2";

import copydir from "copy-dir";
import generatePost from "./contentGenerator";
import mkdirp from "mkdirp";
import path from "path";
import posts from "./posts";
import { promisify } from "util";
import rimraf from "rimraf";
import { EmailTemplates, ROLES } from "../../../graphql/types";
import { toSlug } from "@/graphql/resolvers/helpers";
import fs from "fs";
import { defaultSettings, subjects } from "./constants";
import { createAuthorWithSettings } from "@/graphql/resolvers/author";
import { getToken } from "@/shared/token";

const mkdirpAsync = promisify(mkdirp);
const rimrafAsync = promisify(rimraf);
const copydirAsync = promisify(copydir);

// All paths are relative to this file
const dataDir = "../../../../data";
const publicUploadsDir = "../../../../public/uploads";
const uploadsSourceDir = "./uploads";

function absPath(p) {
  return path.join(__dirname, p);
}
type ModelsType = any;

export const seed = async (folderCheck = true) => {
  if (folderCheck) {
    console.time("ensure data directories");
    await Promise.all([
      mkdirpAsync(absPath(dataDir)),
      mkdirpAsync(absPath(publicUploadsDir)),
    ]);
    console.timeEnd("ensure data directories");
  }

  console.time("sync sequelize models");
  await connection.sync({ force: true });
  console.timeEnd("sync sequelize models");
  if (folderCheck) {
    // do some clean first. delete the uploads folder
    console.time("sync uploads");
    //@ts-ignore
    await rimrafAsync(path.join(absPath(publicUploadsDir, "*")));
    await copydirAsync(absPath(uploadsSourceDir), absPath(publicUploadsDir));
    console.timeEnd("sync uploads");
  }

  console.time("insert roles and permissions");
  await insertRolePermData(models);
  console.timeEnd("insert roles and permissions");

  console.time("insert authors");
  await insertAuthor();
  console.timeEnd("insert authors");

  console.time("insert Tags");
  await insertTags();
  console.timeEnd("insert Tags");

  console.time("insert posts, media");
  const [tags] = await Promise.all([models.Tag.findAll()]);

  await Promise.all([...posts.map((post) => insertPost(post, models, tags))]);
  // await insertMedia();
  console.timeEnd("insert posts, media");

  console.time("insert emails");
  await insertEmails();
  console.timeEnd("insert emails");
};

export async function insertRolePermData(models: ModelsType) {
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
      role.$add("permission", READ_ONLY_POSTS),
      role.$add("permission", MANAGE_ALL_POSTS),
      role.$add("permission", MANAGE_USERS),
      role.$add("permission", MANAGE_SETTINGS),
      role.$add("permission", MANAGE_OWN_POSTS),
    ]);
  }

  async function reviewer() {
    const role = await models.Role.create({ name: "REVIEWER" });
    return role.$add("permission", MANAGE_ALL_POSTS);
  }

  async function reader() {
    const role = await models.Role.create({ name: "READER" });
    return role.$add("permission", READ_ONLY_POSTS);
  }

  async function author() {
    const role = await models.Role.create({ name: "AUTHOR" });
    return role.$add("permission", MANAGE_OWN_POSTS);
  }

  return Promise.all([admin(), reviewer(), reader(), author()]);
}

export async function insertAuthor() {
  const adminAuthor = await createAuthorWithSettings(
    {
      name: "Admin",
      email: "admin@admin.com",
      username: "admin",
      password: "admin",
      token: "",
    },
    { site_title: "Admin Account" },
    ROLES.ADMIN,
  );
  await adminAuthor.update({ verified: true });

  const demoAuthor = await createAuthorWithSettings(
    {
      name: "Demo Author",
      email: "demo@demo.com",
      username: "demo",
      password: "demo",
      token: "",
    },
    { site_title: "Demo Account", site_tagline: "Hello, I am letterpad" },
  );
  await demoAuthor.update({
    verified: true,
    social: {
      twitter: "https://twitter.com",
      facebook: "https://facebook.com",
      github: "https://github.com",
      instagram: "https://instagram.com",
    },
    bio: "You can some information about yourself for the world to know you a little better.",
    avatar:
      "https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
  });
  return Promise.all([adminAuthor, demoAuthor]);
}

export async function insertTags() {
  const author = await models.Author.findOne({ where: { username: "demo" } });
  const tags = [
    {
      name: "Home",
      slug: "home",
      desc: "tag desc",
    },
    {
      name: "first-post",
      slug: "first-post",
      desc: "tag desc",
    },
  ];

  if (author) {
    return Promise.all([...tags.map((tag) => author.$create("tag", tag))]);
  }
}

export async function insertPost(params, models: ModelsType, tags) {
  // get author  // 1 or 2
  const { html } = generatePost(params.type);
  let promises: any[] = [];
  let author = await models.Author.findOne({
    where: { email: "demo@demo.com" },
  });

  const slug = toSlug(params.title);
  let post = await models.Post.create({
    title: params.title,
    html: html,
    excerpt:
      "You can use this space to write a small description about the topic. This will be helpful in SEO.",
    cover_image: params.cover_image,
    authorId: author?.id,
    type: params.type,
    status: params.status,
    slug: slug,
    createdAt: getDateTime(),
    publishedAt: getDateTime(),
    reading_time: "5 mins",
  });
  if (author && post) {
    promises = [author.$add("post", post)];
    if (params.type === "post") {
      promises = [...promises, ...tags.map((tag) => post.$add("tag", tag))];
    }

    return Promise.all(promises);
  }
}

// export async function insertMedia() {
//   const author = await models.Author.findOne({ where: { id: 2 } });
//   if (author) {
//     try {
//       await author?.$create("upload", {
//         url: "https://images.unsplash.com/photo-1473181488821-2d23949a045a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
//         name: "Blueberries",
//         width: 1350,
//         height: 900,
//         description:
//           "Write a description about this image. You never know how this image can break the internet",
//       });

//       await author?.$create("upload", {
//         url: "https://images.unsplash.com/photo-1524654458049-e36be0721fa2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
//         width: 1350,
//         height: 900,
//         name: "I love the beach and its smell",
//         description:
//           "Write a description about this image. You never know how this image can break the internet",
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }

export const getDateTime = (d?: Date) => {
  const m = d ? new Date(d) : new Date();

  return (
    m.getUTCFullYear() +
    "-" +
    ("0" + (m.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("0" + m.getUTCDate()).slice(-2) +
    " " +
    ("0" + m.getUTCHours()).slice(-2) +
    ":" +
    ("0" + m.getUTCMinutes()).slice(-2) +
    ":" +
    ("0" + m.getUTCSeconds()).slice(-2)
  );
};

async function insertEmails() {
  const verifyNewUserEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/verifyNewUser.twig"),
  );
  await models.Email.create({
    template_id: EmailTemplates.VERIFY_NEW_USER,
    subject: subjects.VERIFY_NEW_USER,
    body: verifyNewUserEmail.toString(),
  });

  const verifyNewSubscriberEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/verifyNewSubscriber.twig"),
  );
  await models.Email.create({
    template_id: EmailTemplates.VERIFY_NEW_SUBSCRIBER,
    subject: subjects.VERIFY_NEW_SUBSCRIBER,
    body: verifyNewSubscriberEmail.toString(),
  });

  const forgotPasswordEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/forgotPassword.twig"),
  );
  await models.Email.create({
    template_id: EmailTemplates.FORGOT_PASSWORD,
    subject: subjects.FORGOT_PASSWORD,
    body: forgotPasswordEmail.toString(),
  });

  const newPostEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/newPost.twig"),
  );
  await models.Email.create({
    template_id: EmailTemplates.NEW_POST,
    subject: subjects.NEW_POST,
    body: newPostEmail.toString(),
  });
}

export async function createAdmin() {
  const author = await models.Author.create({
    email: "admin@xxx.com",
    username: "admin",
    verified: true,
    password: "admin",
    name: "Admin",
    bio: "",
    avatar: "",
    social: {
      twitter: "",
      facebook: "",
      github: "",
      instagram: "",
    },
  });
  if (author) {
    const role = await models.Role.findOne({
      where: { name: ROLES.ADMIN },
    });
    if (role) {
      await author.$set("role", role.id);
    }
    const setting = await models.Setting.create({
      ...defaultSettings,
      menu: defaultSettings.menu as any,
      site_url: `https://${author.username}.letterpad.app`,
      site_title: "Admin Account",
      client_token: getToken({ data: { id: author.id }, algorithm: "H256" }),
    });
    await author.$set("setting", setting);
  }
}
