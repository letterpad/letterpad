const env = require("node-env-file");
if (process.env.NODE_ENV === "production") {
  env(__dirname + "../../../../../.env.production.local");
} else {
  env(__dirname + "../../../../../.env.development.local");
}

import { PrismaClient } from "@prisma/client";
import { promisify } from "util";
import copydir from "copy-dir";
import mkdirp from "mkdirp";
import rimraf from "rimraf";
import path from "path";
import { createAuthorWithSettings } from "@/graphql/resolvers/author";
import { ROLES } from "@/graphql/types";
import posts from "./posts";
import generatePost from "./contentGenerator";
import { toSlug } from "@/graphql/resolvers/helpers";
import { getDateTime } from "./seed";

const prisma = new PrismaClient();

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
async function main(folderCheck = true) {
  if (folderCheck) {
    console.time("ensure data directories");
    await Promise.all([
      mkdirpAsync(absPath(dataDir)),
      mkdirpAsync(absPath(publicUploadsDir)),
    ]);
    console.timeEnd("ensure data directories");
  }

  if (folderCheck) {
    // do some clean first. delete the uploads folder
    console.time("sync uploads");
    //@ts-ignore
    await rimrafAsync(path.join(absPath(publicUploadsDir, "*")));
    await copydirAsync(absPath(uploadsSourceDir), absPath(publicUploadsDir));
    console.timeEnd("sync uploads");
  }

  console.time("insert roles and permissions");
  await insertRolePermData();
  console.timeEnd("insert roles and permissions");

  console.time("Insert authors and settings and assign role");
  await insertAuthors();
  console.timeEnd("Insert authors and settings and assign role");

  console.time("Insert post and page and tags");
  const author = await prisma.author.findFirst({
    where: { email: "demo@demo.com" },
  });
  await insertPost(posts[0], author?.id);
  await insertPost(posts[1], author?.id);
  await insertPost(posts[2], author?.id);
  await insertPost(posts[3], author?.id);
  console.timeEnd("Insert post and page and tags");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export async function insertRolePermData() {
  const [
    MANAGE_OWN_POSTS,
    READ_ONLY_POSTS,
    MANAGE_ALL_POSTS,
    MANAGE_USERS,
    MANAGE_SETTINGS,
  ] = await Promise.all([
    prisma.permission.create({
      data: {
        name: "MANAGE_OWN_POSTS",
      },
    }),
    prisma.permission.create({
      data: { name: "READ_ONLY_POSTS" },
    }),
    prisma.permission.create({
      data: { name: "MANAGE_ALL_POSTS" },
    }),
    prisma.permission.create({
      data: { name: "MANAGE_USERS" },
    }),
    prisma.permission.create({
      data: { name: "MANAGE_SETTINGS" },
    }),
  ]);

  const [ADMIN, AUTHOR, REVIEWER, READER] = await Promise.all([
    await prisma.role.create({
      data: {
        name: "ADMIN",
      },
    }),
    await prisma.role.create({
      data: {
        name: "AUTHOR",
      },
    }),
    await prisma.role.create({
      data: {
        name: "REVIEWER",
      },
    }),
    await prisma.role.create({
      data: {
        name: "READER",
      },
    }),
  ]);

  async function admin() {
    return Promise.all([
      ...[
        MANAGE_OWN_POSTS,
        READ_ONLY_POSTS,
        MANAGE_ALL_POSTS,
        MANAGE_USERS,
        MANAGE_SETTINGS,
      ].map((permission) =>
        prisma.rolePermissions.create({
          data: {
            permission_id: permission.id,
            role_id: ADMIN.id,
          },
        }),
      ),
    ]);
  }

  async function reviewer() {
    return Promise.all([
      ...[MANAGE_ALL_POSTS].map((permission) =>
        prisma.rolePermissions.create({
          data: {
            permission_id: permission.id,
            role_id: REVIEWER.id,
          },
        }),
      ),
    ]);
  }

  async function reader() {
    return Promise.all([
      ...[READ_ONLY_POSTS].map((permission) =>
        prisma.rolePermissions.create({
          data: {
            permission_id: permission.id,
            role_id: READER.id,
          },
        }),
      ),
    ]);
  }

  async function author() {
    return Promise.all([
      ...[MANAGE_OWN_POSTS].map((permission) =>
        prisma.rolePermissions.create({
          data: {
            permission_id: permission.id,
            role_id: AUTHOR.id,
          },
        }),
      ),
    ]);
  }

  return Promise.all([admin(), reviewer(), reader(), author()]);
}

async function insertAuthors() {
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
  await prisma.author.update({
    where: { id: adminAuthor?.id },
    data: { verified: true },
  });

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

  return await prisma.author.update({
    where: { id: demoAuthor?.id },
    data: {
      verified: true,
      social: JSON.stringify({
        twitter: "https://twitter.com",
        facebook: "https://facebook.com",
        github: "https://github.com",
        instagram: "https://instagram.com",
      }),
      bio: "You can some information about yourself for the world to know you a little better.",
      avatar:
        "https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
    },
  });
}
export async function insertPost(postData, author_id) {
  const { html } = generatePost(postData.type);

  const slug = toSlug(postData.title);

  return prisma.post.create({
    data: {
      title: postData.title,
      html: html,
      excerpt:
        "You can use this space to write a small description about the topic. This will be helpful in SEO.",
      cover_image: postData.cover_image,
      cover_image_width: 100,
      cover_image_height: 100,
      type: postData.type,
      status: postData.status,
      slug: slug,
      publishedAt: new Date(getDateTime()).toISOString(),
      reading_time: "5 mins",
      createdAt: new Date().toISOString(),
      tags:
        postData.type === "post"
          ? {
              connectOrCreate: [
                {
                  create: tags[0],
                  where: { name: tags[0].name },
                },
                {
                  create: tags[1],
                  where: { name: tags[1].name },
                },
              ],
            }
          : undefined,
      author: {
        connect: {
          id: author_id,
        },
      },
    },
  });
}

export {};
