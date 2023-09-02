require("dotenv/config");
/* eslint-disable no-console */
import copydir from "copy-dir";
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { promisify } from "util";

import { prisma } from "@/lib/prisma";

import { createAuthorWithSettings } from "@/components/onboard";

import { RegisterStep } from "@/__generated__/__types__";
import { ROLES } from "@/graphql/types";
import logger from "@/shared/logger";
import { getDateTime } from "@/shared/utils";
import { textToSlug } from "@/utils/slug";

import generatePost from "./contentGenerator";
import { postsList } from "./posts";
import { encryptEmail } from "../../../shared/clientToken";

const rimrafAsync = promisify(rimraf);
const copydirAsync = promisify(copydir);

const ROOT_DIR = path.join(__dirname, "../../../");

// All paths are relative to this file
const publicUploadsDir = path.join(ROOT_DIR, "public/uploads");
const uploadsSourceDir = path.join(ROOT_DIR, "graphql/db/seed/uploads");
function absPath(p) {
  return p;
}
const tags = [
  {
    name: "home",
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
      } catch (e: any) {
        logger.error(e);
        throw "Couldnt clean database tables";
      }
      console.timeEnd("delete all recoreds from all tables");

      console.time("ensure data directories");
      try {
        await Promise.all([
          // fs.promises.mkdir(absPath(dataDir), { recursive: true }),
          fs.promises.mkdir(absPath(publicUploadsDir), { recursive: true }),
        ]);
      } catch (e) {
        logger.error(e);
      }
      console.timeEnd("ensure data directories");
    }
    if (folderCheck) {
      console.time("sync uploads");
      try {
        //@ts-ignore
        await rimrafAsync(path.join(absPath(publicUploadsDir, "*")));
        await copydirAsync(
          absPath(uploadsSourceDir),
          absPath(publicUploadsDir)
        );
      } catch (e) {
        logger.error(e);
      }
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
      where: { email: process.env.EMAIL || "demo@demo.com" },
    });
    await insertPost(postsList[0], author?.id);
    if (!process.env.EMAIL) {
      await insertPost(postsList[1], author?.id);
      await insertPost(postsList[2], author?.id);
    }
    console.timeEnd("Insert post and page and tags");
  } catch (e: any) {
    console.log(e);
    logger.error(e);
    throw e;
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
        })
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
        })
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
        })
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
        })
      ),
    ]);
  }

  return Promise.all([admin(), reviewer(), reader(), author()]);
}

async function insertAuthors() {
  const demoAuthor = await createAuthorWithSettings(
    {
      name: "{Author Name}",
      email: process.env.EMAIL || "demo@demo.com",
      username: "demo",
      password: process.env.PASSWORD || "demo",
      register_step: RegisterStep.Registered,
      token: "",
    },
    {
      site_title: "My new blog",
      site_tagline: "Easily create and publish your blog on Letterpad",
      site_url: "http://localhost:3000",
    }
  );

  return await prisma.author.update({
    where: { id: demoAuthor?.id },
    data: {
      verified: true,
      social: JSON.stringify({
        twitter: "",
        facebook: "",
        github: "",
        instagram: "",
        linkedin: "",
      }),
      occupation: "{Your Occupation}",
      company_name: "Letterpad",
      bio: "You can write some information about yourself for the world to know you a little better.",
      avatar:
        "https://res.cloudinary.com/abhisheksaha/image/upload/v1672944041/blog-images/6611482_account_avatar_basic_person_user_icon_eisadm.png",
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
      page_type: "default",
      page_data: JSON.stringify({ rows: [] }),
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
      stats: JSON.stringify({
        characters: 1000,
        reading_time: 2,
        spaceless_characters: 800,
        words: 200,
      }),
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

// const fs = require("fs").promises;

async function walk(dir) {
  let files: any = await fs.promises.readdir(dir);
  files = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) return walk(filePath);
      else if (stats.isFile()) return filePath;
    })
  );

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

export const cleanupDatabase = async () => {
  await prisma.permission.deleteMany();
  await prisma.author.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.email.deleteMany();
  await prisma.emailDelivery.deleteMany();
  await prisma.post.deleteMany();
  await prisma.rolePermissions.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.role.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.upload.deleteMany();
};
