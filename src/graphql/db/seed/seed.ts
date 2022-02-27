import Prisma, { prisma } from "@/lib/prisma";
import { promisify } from "util";
import copydir from "copy-dir";
import mkdirp from "mkdirp";
import rimraf from "rimraf";
import path from "path";
import { createAuthorWithSettings } from "@/graphql/resolvers/author";
import { EmailTemplates, ROLES } from "@/graphql/types";
import posts from "./posts";
import generatePost from "./contentGenerator";
import { toSlug } from "@/graphql/resolvers/helpers";
import { getDateTime } from "@/shared/utils";
import { subjects } from "./constants";
import fs from "fs";

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
      } catch (e) {}
      console.timeEnd("delete all recoreds from all tables");
      console.time("ensure data directories");
      await Promise.all([
        mkdirpAsync(absPath(dataDir)),
        mkdirpAsync(absPath(publicUploadsDir)),
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
    console.time("insert email templates");
    await insertEmails();
    console.timeEnd("insert email templates");
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

async function insertEmails() {
  const verifyNewUserEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/verifyNewUser.twig"),
  );
  await prisma.email.create({
    data: {
      template_id: EmailTemplates.VERIFY_NEW_USER,
      subject: subjects.VERIFY_NEW_USER,
      body: verifyNewUserEmail.toString(),
    },
  });

  const verifyNewSubscriberEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/verifyNewSubscriber.twig"),
  );
  await prisma.email.create({
    data: {
      template_id: EmailTemplates.VERIFY_NEW_SUBSCRIBER,
      subject: subjects.VERIFY_NEW_SUBSCRIBER,
      body: verifyNewSubscriberEmail.toString(),
    },
  });

  const forgotPasswordEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/forgotPassword.twig"),
  );
  await prisma.email.create({
    data: {
      template_id: EmailTemplates.FORGOT_PASSWORD,
      subject: subjects.FORGOT_PASSWORD,
      body: forgotPasswordEmail.toString(),
    },
  });

  const newPostEmail = fs.readFileSync(
    path.join(__dirname, "email-templates/newPost.twig"),
  );
  await prisma.email.create({
    data: {
      template_id: EmailTemplates.NEW_POST,
      subject: subjects.NEW_POST,
      body: newPostEmail.toString(),
    },
  });
}

export const cleanupDatabase = () => {
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => {
      const model = prisma[deCapitalizeFirstLetter(modelName)];
      return model ? model.deleteMany() : null;
    }),
  );
};

function deCapitalizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}
