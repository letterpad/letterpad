import {
  MutationResolvers,
  InputAuthor,
  PostStatusOptions,
  PostTypes,
  QueryResolvers,
  Author as AuthorType,
  InputCreateAuthor,
  SettingInputType,
} from "@/__generated__/__types__";
import { models as newModels } from "@/graphql/db/models/models";
import bcrypt from "bcryptjs";
import { validateCaptcha } from "./helpers";
import generatePost from "@/graphql/db/seed/contentGenerator";
import siteConfig from "../../../config/site.config";
import { createAdmin, seed } from "@/graphql/db/seed/seed";
import { decodeToken, getToken, verifyToken } from "@/shared/token";
import { EmailTemplates, ROLES } from "../types";
import logger from "@/shared/logger";
import { getDateTime } from "@/shared/utils";
import { defaultSettings } from "../db/seed/constants";
import { ResolverContext } from "../context";

interface InputAuthorForDb extends Omit<InputAuthor, "social"> {
  social: string;
}

const Author = {
  role: async ({ id }, _args, { models }) => {
    const author = await models.Author.findOne({ where: { id } });
    if (!author) return;
    try {
      const role = await author.$get("role");
      const name = role.get("name");
      return name;
    } catch (e) {
      throw e;
    }
  },
  permissions: async ({ id }, _args, { models }) => {
    const author = await models.Author.findOne({ where: { id } });
    if (!author) return;

    try {
      const role = await author.$get("role");
      const permissions = await role.$get("permissions");
      return permissions.map((p) => p.get("name"));
    } catch (e) {
      throw e;
    }
  },
};

const Query: QueryResolvers<ResolverContext> = {
  async me(_parent, _args, { session, models }, _info) {
    if (!session?.user.id) {
      return { __typename: "AuthorNotFoundError", message: "Invalid Session" };
    }
    const author = await models.Author.findOne({
      where: {
        id: session.user.id,
      },
    });

    if (!author) {
      return { __typename: "AuthorNotFoundError", message: "" };
    }
    try {
      author.social = JSON.parse(author.social as string);
    } catch (e) {
      //
    }
    if (author.avatar && author.avatar.startsWith("/")) {
      author.avatar = new URL(author.avatar, process.env.ROOT_URL).href;
    }
    const resolvedAuthor = author.get() as unknown as AuthorType;
    return { ...resolvedAuthor, __typename: "Author" };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async createAuthor(_, args, { models, connection, mailUtils }) {
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

    const dbSeeded = await isDatabaseSeeded(connection);
    if (!dbSeeded) {
      logger.debug("Database not seeded. Seeding now.");
      await seed(false);
      await createAdmin();
    }

    const authorExistData = await models.Author.findOne({
      where: { email: args.data?.email },
    });

    if (authorExistData) {
      return {
        __typename: "CreateAuthorError",
        message: "Author already exist",
      };
    }

    const usernameExist = await models.Author.findOne({
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
      const { post, page } = getWelcomePostAndPage();
      const newPost = await newAuthor.$create("post", post);
      const newTag = await newAuthor.$create("tag", {
        name: siteConfig.first_post_tag,
        slug: siteConfig.first_post_tag,
      });
      await newPost.$add("tag", newTag);
      await newAuthor.$create("post", page);

      const a = newAuthor.get() as unknown as AuthorType;
      if (mailUtils.enqueueEmailAndSend) {
        await mailUtils.enqueueEmailAndSend({
          author_id: a.id,
          template_id: EmailTemplates.VERIFY_NEW_USER,
        });
      }

      return { ...a, __typename: "Author" };
    }
    return {
      __typename: "CreateAuthorError",
      message: "Something went wrong and we dont know what.",
    };
  },
  async login(_parent, args, { models }, _info) {
    const author = await models.Author.findOne({
      where: { email: args.data?.email },
      raw: true,
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

      if (!authenticated)
        return {
          __typename: "LoginError",
          message: "Incorrect credentials",
        };
      try {
        return {
          __typename: "Author",
          ...author,
        };
      } catch (e) {
        console.log(e);
      }
    }
    return {
      __typename: "LoginError",
      message: "Incorrect email id",
    };
  },
  async updateAuthor(_root, args, { session, models }) {
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
      await models.Author.update(dataToUpdate as any, {
        where: { id: args.author.id },
      });
      const author = await models.Author.findOne({
        where: { id: args.author.id },
      });
      if (author) {
        try {
          author.social = JSON.parse(author.social as string);
        } catch (e) {
          //
        }
      }
      return {
        ok: true,
        data: author?.get() || undefined,
      };
    } catch (e: any) {
      return {
        ok: false,
        errors: [{ message: e.message, path: "updateAuthor resolver" }],
      };
    }
  },
  async forgotPassword(_root, args, { models, mailUtils }) {
    try {
      const email = args.email;
      const author = await models.Author.findOne({
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
  async resetPassword(_root, args, { models }) {
    try {
      const token = args.token;
      const isValidToken = verifyToken(token);
      if (!isValidToken) {
        throw new Error("The link is not valid.");
      }

      const authorEmail = decodeToken(token);

      const author = await models.Author.findOne({
        where: { email: authorEmail },
      });

      if (!author) {
        throw new Error("Sorry, we could not validate this request.");
      }
      const newPassword = await bcrypt.hash(args.password, 12);

      await models.Author.update(
        { password: newPassword },
        { where: { id: author.id } },
      );

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
    createdAt: getDateTime(),
    publishedAt: getDateTime(),
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
    createdAt: getDateTime(),
    publishedAt: getDateTime(),
    html_draft: "",
  };

  return { page, post };
}

async function isDatabaseSeeded(connection): Promise<boolean> {
  try {
    await connection.query("SELECT * FROM authors");
    return true;
  } catch (e) {
    if (e.name === "SequelizeDatabaseError") {
      return false;
    }
  }
  return false;
}

export async function createAuthorWithSettings(
  data: InputCreateAuthor,
  setting: SettingInputType,
  rolename: ROLES = ROLES.AUTHOR,
) {
  const { token, ...authorData } = data;
  const role = await newModels.Role.findOne({ where: { name: rolename } });
  const author = await newModels.Author.create({
    ...authorData,
    avatar: "",
    verified: false,
    bio: "",
    social: {
      twitter: "",
      facebook: "",
      github: "",
      instagram: "",
    },
    password: bcrypt.hashSync(data.password, 12),
  });
  if (author && role) {
    author.$set("role", role);
    const newSettingRecord = await newModels.Setting.create({
      ...defaultSettings,
      menu: defaultSettings.menu as any,
      site_url: `https://${data.username}.letterpad.app`,
      ...setting,
      client_token: getToken({ data: { id: author.id }, algorithm: "HS256" }),
    });
    await author.$set("setting", newSettingRecord);
  }
  return author;
}
