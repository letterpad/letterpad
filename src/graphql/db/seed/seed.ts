/* eslint-disable no-console */
import copydir from "copy-dir";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { promisify } from "util";

import { createAuthorWithSettings } from "@/lib/onboard";
import { prisma } from "@/lib/prisma";

import { ROLES } from "@/graphql/types";
import logger from "@/shared/logger";
import { getDateTime } from "@/shared/utils";
import { textToSlug } from "@/utils/slug";

import generatePost from "./contentGenerator";
import posts from "./posts";

const rimrafAsync = promisify(rimraf);
const copydirAsync = promisify(copydir);

const ROOT_DIR = process.env.ROOT || path.join(__dirname, "../../../../");

// All paths are relative to this file
const dataDir = path.join(ROOT_DIR, "/data");
const publicUploadsDir = path.join(ROOT_DIR, "/public/uploads");
const uploadsSourceDir = path.join(ROOT_DIR, "/src/graphql/db/seed/uploads");

function absPath(p) {
  return p;
}
const tags = [
  {
    name: "Home",
    slug: "home",
  },
  {
    name: "first-post",
    slug: "first-post",
  },
];

export async function seed(folderCheck = true) {
  try {
    if (folderCheck) {
      console.time("delete all recoreds from all tables");
      try {
        await cleanupDatabase();
      } catch (e) {
        logger.error(e);
        throw "error";
      }
      console.timeEnd("delete all recoreds from all tables");
      console.time("ensure data directories");
      console.log(absPath(dataDir));
      console.log(absPath(publicUploadsDir));
      await Promise.all([
        fs.promises.mkdir(absPath(dataDir), { recursive: true }),
        fs.promises.mkdir(absPath(publicUploadsDir), { recursive: true }),
      ]);
      console.timeEnd("ensure data directories");
    }
    if (folderCheck) {
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
  } catch (e) {
    console.log("seeding failed", e);
  } finally {
    await prisma.$disconnect();
  }
}

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
        linkedin: "https://linkedin.com",
      }),
      occupation: "Principal Engineer @ Ajaxtown",
      company_name: "Letterpad",
      bio: "You can write some information about yourself for the world to know you a little better.",
      avatar:
        "https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
    },
  });
}
export async function insertPost(postData, author_id) {
  const { html } = generatePost(postData.type);

  const slug = textToSlug(postData.title);

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

export const cleanupDatabase = () => {
  const modelNames = Object.keys(prisma).filter((key) => {
    return key.startsWith("_") ? false : true;
  });

  return Promise.all(
    modelNames.map((modelName) => {
      const model = prisma[modelName];
      return model ? model.deleteMany() : null;
    }),
  );
};
