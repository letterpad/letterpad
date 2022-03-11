import {
  MutationResolvers,
  InputAuthor,
  PostStatusOptions,
  PostTypes,
  QueryResolvers,
  InputCreateAuthor,
  SettingInputType,
  Social,
} from "@/__generated__/__types__";
import bcrypt from "bcryptjs";
import { validateCaptcha } from "./helpers";
import generatePost from "@/graphql/db/seed/contentGenerator";
import siteConfig from "../../../config/site.config";
import { decodeToken, verifyToken } from "@/shared/token";
import { EmailTemplates, ROLES } from "../types";
import logger from "@/shared/logger";
import { defaultSettings } from "../db/seed/constants";
import { ResolverContext } from "../context";
import { prisma } from "@/lib/prisma";
import { mapAuthorToGraphql, mapSettingToDb } from "./mapper";
import { encryptEmail } from "@/shared/clientToken";

interface InputAuthorForDb extends Omit<InputAuthor, "social"> {
  social: string;
}

const Author = {
  role: async ({ id }, _args, { prisma }: ResolverContext) => {
    const author = await prisma.author.findFirst({
      where: { id },
    });
    if (!author || !author.role_id) return;
    try {
      const role = await prisma.role.findFirst({
        where: { id: author.role_id },
      });

      return role?.name;
    } catch (e) {
      throw e;
    }
  },
  permissions: async ({ id }, _args, { prisma }: ResolverContext) => {
    const author = await prisma.author.findFirst({
      where: { id },
    });
    if (!author || !author.role_id) return [];
    const permissions = await prisma.rolePermissions.findMany({
      where: { role_id: author.role_id },
      include: {
        permission: true,
      },
    });
    return permissions.map((p) => p.permission.name);
  },
  social: ({ social }) => {
    if (typeof social === "string") {
      return JSON.parse(social);
    }
    return social;
  },
};

const Query: QueryResolvers<ResolverContext> = {
  async me(_parent, _args, { session, prisma, author_id }, _info) {
    author_id = session?.user.id || author_id;

    const author = await prisma.author.findFirst({
      where: {
        id: author_id,
      },
    });
    if (author) {
      let avatar = author.avatar as string;
      if (avatar && avatar.startsWith("/")) {
        avatar = new URL(avatar, process.env.ROOT_URL).href;
      }

      return {
        ...author,
        social: JSON.parse(author.social as string) as Social,
        avatar,
        __typename: "Author",
      };
    }

    return { __typename: "AuthorNotFoundError", message: "Invalid Session" };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async createAuthor(_, args, { prisma, mailUtils }) {
    if (args.data.token) {
      const response = await validateCaptcha(
        process.env.RECAPTCHA_KEY_SERVER,
        args.data.token,
      );
      if (!response) {
        return {
          __typename: "CreateAuthorError",
          message: "We cannot allow you at the moment.",
        };
      }
    }

    const authorExistData = await prisma.author.findFirst({
      where: { email: args.data?.email },
    });

    if (authorExistData) {
      return {
        __typename: "CreateAuthorError",
        message: "Author already exist",
      };
    }

    const usernameExist = await prisma.author.findFirst({
      where: { username: args.data?.username },
    });

    if (usernameExist) {
      return {
        __typename: "CreateAuthorError",
        message: "Username already exist",
      };
    }

    const { setting = {}, ...authorData } = args.data;

    const newAuthor = await createAuthorWithSettings(authorData, setting);

    if (newAuthor) {
      // create new tag for author
      const newTag = {
        name: siteConfig.first_post_tag,
        slug: siteConfig.first_post_tag,
      };

      const welcomeContent = getWelcomePostAndPage();
      await prisma.post.create({
        data: {
          ...welcomeContent.post,
          author: {
            connect: { id: newAuthor.id },
          },
          tags: {
            connectOrCreate: {
              create: { name: newTag.name },
              where: { name: newTag.name },
            },
          },
        },
      });

      await prisma.post.create({
        data: {
          ...welcomeContent.page,
          author: {
            connect: { id: newAuthor.id },
          },
        },
      });

      if (mailUtils.enqueueEmailAndSend) {
        await mailUtils.enqueueEmailAndSend({
          author_id: newAuthor.id,
          template_id: EmailTemplates.VERIFY_NEW_USER,
        });
      }
      const { id, email, username, name } = newAuthor;
      return {
        __typename: "Author",
        id,
        email,
        username,
        name,
      };
    }
    return {
      __typename: "CreateAuthorError",
      message: "Something went wrong and we dont know what.",
    };
  },
  async login(_parent, args, { prisma }, _info) {
    const author = await prisma.author.findFirst({
      where: { email: args.data?.email },
    });
    if (author) {
      if (!author?.verified) {
        return {
          __typename: "LoginError",
          message: "Your email id is not verified yet.",
        };
      }
      const authenticated = await bcrypt.compare(
        args.data?.password || "",
        author.password,
      );

      if (!authenticated) {
        return {
          __typename: "LoginError",
          message: "Incorrect credentials",
        };
      }

      return {
        ...mapAuthorToGraphql(author),
      };
    }
    return {
      __typename: "LoginError",
      message: "Incorrect email id",
    };
  },
  async updateAuthor(_root, args, { session, prisma }) {
    if (session?.user.id !== args.author.id) {
      return {
        ok: true,
        errors: [{ message: "No session", path: "updateAuthor resolver" }],
      };
    }
    try {
      const dataToUpdate = { ...args.author } as InputAuthorForDb;

      if (args.author.password) {
        dataToUpdate.password = await bcrypt.hash(args.author.password, 12);
      }

      logger.info("Updating Author => ", dataToUpdate);
      const author = await prisma.author.update({
        data: dataToUpdate,
        where: { id: args.author.id },
      });
      return {
        ok: true,
        data: mapAuthorToGraphql(author),
      };
    } catch (e: any) {
      return {
        ok: false,
        errors: [{ message: e.message, path: "updateAuthor resolver" }],
      };
    }
  },
  async forgotPassword(_root, args, { prisma, mailUtils }) {
    try {
      const email = args.email;
      const author = await prisma.author.findFirst({
        where: { email },
      });
      if (!author) {
        throw new Error("Email does not exist");
      }
      if (author.verify_attempt_left === 0) {
        throw new Error("No more attempts left.");
      }
      if (mailUtils.enqueueEmailAndSend) {
        await mailUtils.enqueueEmailAndSend({
          template_id: EmailTemplates.FORGOT_PASSWORD,
          author_id: author.id,
        });
      }
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        msg: "Something unexpected happened",
      };
    }
  },
  async resetPassword(_root, args, { prisma }) {
    try {
      const token = args.token;
      const isValidToken = verifyToken(token);
      if (!isValidToken) {
        throw new Error("The link is not valid.");
      }

      const authorEmail = decodeToken(token);

      const author = await prisma.author.findFirst({
        where: { email: authorEmail },
      });

      if (!author) {
        throw new Error("Sorry, we could not validate this request.");
      }
      const newPassword = await bcrypt.hash(args.password, 12);

      await prisma.author.update({
        data: {
          password: newPassword,
        },
        where: { id: author.id },
      });

      return {
        ok: true,
        msg: "Password changed successfully",
      };
    } catch (e: any) {
      return {
        ok: false,
        msg: e.message,
      };
    }
  },
};

export default { Mutation, Author, Query };

function getWelcomePostAndPage() {
  const post_cover =
    "https://images.unsplash.com/photo-1516035054744-d474c5209db5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80";

  let { html } = generatePost(PostTypes.Post);
  let title = "Welcome to Letterpad";

  const post = {
    title: "Welcome to Letterpad",
    html: html,
    excerpt:
      "You can use this space to write a small description about the topic. This will be helpful in SEO.",
    cover_image: post_cover,
    cover_image_width: 1500,
    cover_image_height: 900,
    type: PostTypes.Post,
    status: PostStatusOptions.Published,
    slug: title.toLocaleLowerCase().replace(/ /g, "-"),
    createdAt: new Date(),
    publishedAt: new Date(),
    reading_time: "5 mins",
  };

  const pageContent = generatePost(PostTypes.Page);
  title = "Letterpad Typography";

  const page = {
    title,
    type: PostTypes.Page,
    html: pageContent.html,
    status: PostStatusOptions.Published,
    excerpt:
      "You can use this space to write a small description about this page. This will be helpful in SEO.",
    slug: title.toLocaleLowerCase().replace(/ /g, "-"),
    cover_image:
      "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    cover_image_width: 1482,
    cover_image_height: 900,
    createdAt: new Date(),
    publishedAt: new Date(),
    html_draft: "",
  };

  return { page, post };
}

export async function createAuthorWithSettings(
  data: InputCreateAuthor,
  setting: SettingInputType,
  rolename: ROLES = ROLES.AUTHOR,
) {
  const { token, ...authorData } = data;
  const role = await prisma.role.findFirst({ where: { name: rolename } });
  if (role) {
    const newAuthor = await prisma.author.create({
      data: {
        ...authorData,
        avatar: "",
        verified: false,
        bio: "",
        social: JSON.stringify({
          twitter: "",
          facebook: "",
          github: "",
          instagram: "",
        }),
        password: bcrypt.hashSync(data.password, 12),
        role: {
          connect: { id: role.id },
        },
        setting: {
          create: {
            ...defaultSettings,
            ...mapSettingToDb(setting),
          },
        },
      },
    });
    console.log(encryptEmail(authorData.email));
    const updatedNewAuthor = prisma.author.update({
      where: { id: newAuthor.id },
      data: {
        setting: {
          update: {
            client_token: encryptEmail(authorData.email),
          },
        },
      },
    });
    return updatedNewAuthor;
  }
}
