import { Subjects } from "./../../mail/index";
import Cryptr from "cryptr";
import jwt from "jsonwebtoken";
import {
  InputAuthor,
  PostStatusOptions,
  PostTypes,
  QueryResolvers,
} from "@/__generated__/type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { MutationResolvers } from "@/__generated__/type-defs.graphqls";
import models from "../db/models";
import bcrypt from "bcryptjs";
import { settingsData } from "../db/models/setting";
import { validateCaptcha } from "./helpers";
import generatePost from "../db/seed/contentGenerator";
import sendMail from "src/mail";
import templates from "src/mail/templates";

const cryptr = new Cryptr(process.env.SECRET_KEY);

interface InputAuthorForDb extends Omit<InputAuthor, "social"> {
  social: string;
}

const Author = {
  role: async ({ id }) => {
    const author = await models.Author.findOne({ where: { id } });
    if (!author) return;
    try {
      const role = await author.getRole();
      return role.name;
    } catch (e) {
      throw new Error(e);
    }
  },
  permissions: async ({ id }) => {
    const author = await models.Author.findOne({ where: { id } });
    if (!author) return;

    try {
      const role = await author.getRole();
      const permissions = await role.getPermissions();
      return permissions.map(p => p.name);
    } catch (e) {
      throw new Error(e);
    }
  },
};

const Query: QueryResolvers<ResolverContext> = {
  async me(_parent, _args, { session }, _info) {
    if (!session?.user) {
      return { __typename: "AuthorNotFoundError", message: "Invalid Session" };
    }

    const author = await models.Author.findOne({
      where: {
        id: session.user.id,
      },
    });
    if (author && author.social) {
      author.social = JSON.parse((author.social as string) || "{}");
    }
    if (author && author.avatar) {
      if (author.avatar.startsWith("/")) {
        author.avatar = new URL(author.avatar, process.env.ROOT_URL).href;
      }
    }
    return author
      ? { ...author, __typename: "Author" }
      : { __typename: "AuthorNotFoundError", message: "" };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async createAuthor(_, args) {
    if (args.data.token) {
      const response = await validateCaptcha(
        process.env.RECAPTCHA_KEY,
        args.data.token,
      );

      if (!response) {
        return {
          __typename: "CreateAuthorError",
          message: "Are you not a human ?",
        };
      }
    }
    const author = await models.Author.findOne({
      where: { email: args.data?.email },
    });

    if (author) {
      return {
        __typename: "CreateAuthorError",
        message: "Author already exist",
      };
    }

    const newAuthor = await models.Author.create({
      email: args.data.email,
      bio: "",
      password: bcrypt.hashSync(args.data.password, 12),
      name: args.data.name,
      avatar: "",
      username: "",
      verified: false,
      social: JSON.stringify({
        twitter: "",
        facebook: "",
        github: "",
        instagram: "",
      }) as any,
    });

    const role = await models.Role.findOne({ where: { id: 1 } });
    if (newAuthor && role) {
      await newAuthor.setRole(role);
      const setting = await models.Setting.create({
        ...settingsData,
        site_title: args.data.site_title,
        client_token: jwt.sign(
          {
            id: newAuthor,
          },
          process.env.SECRET_KEY,
          {
            algorithm: "HS256",
          },
        ),
      });
      await newAuthor.setSetting(setting);
      const { post, page } = getWelcomePostAndPage();
      const newPost = await newAuthor.createPost(post);
      const newTag = await newAuthor.createTag({
        name: "first-post",
        slug: "first-post",
      });
      await newPost.addTag(newTag);
      await newAuthor.createPost(page);
      //saha
      await sendMail({
        to: newAuthor.email,
        subject: Subjects.VERIFY_EMAIL,
        html: templates.verifyEmail({
          name: newAuthor.name,
          verifyToken: cryptr.encrypt(newAuthor.email),
        }),
      });
      return { ...newAuthor, __typename: "Author" };
    }
    return {
      __typename: "CreateAuthorError",
      message: "Something went wrong and we dont know what.",
    };
  },
  async login(_parent, args, _context, _info) {
    const author = await models.Author.findOne({
      where: { email: args.data?.email },
    });
    if (author) {
      const authenticated = await bcrypt.compare(
        args.data?.password || "",
        author.password,
      );
      if (!authenticated) return { status: false };
      try {
        return {
          status: true,
          data: {
            ...author,
            social: JSON.parse(author.social as string),
          },
        };
      } catch (e) {
        console.log(e);
      }
    }

    return { status: false };
  },
  async updateAuthor(_root, args, { session }) {
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

      if (args.author.social) {
        dataToUpdate.social = JSON.stringify(args.author.social);
      }
      await models.Author.update(dataToUpdate as any, {
        where: { id: args.author.id },
      });

      return {
        ok: true,
        errors: [],
      };
    } catch (e) {
      return {
        ok: false,
        errors: e, //utils.parseErrors(e),
      };
    }
  },
  async forgotPassword(_root, args) {
    try {
      const email = args.email;
      const token = jwt.sign({ email }, process.env.SECRET_KEY, {
        expiresIn: 10 * 60 * 1000,
      });
      const author = await models.Author.findOne({
        where: { email },
      });
      if (!author) {
        throw new Error("Email does not exist");
      }

      await sendMail({
        to: author.email,
        subject: Subjects.FORGOT_PASSWORD,
        html: templates.forgotPasswordEmail({
          name: author.name,
          token: token,
        }),
      });

      return {
        ok: true,
        msg: "Check your email to recover your password",
      };
    } catch (e) {
      return {
        ok: false,
        msg: "Something unexpected happened",
      };
    }
  },
  async resetPassword(_root, args, context) {
    try {
      const token = args.token;
      const isValidToken = jwt.verify(token, process.env.SECRET_KEY);
      if (!isValidToken) {
        throw new Error("Token is not valid");
      }

      const authorEmail = jwt.decode(token);

      const author = await models.Author.findOne({
        where: { email: authorEmail },
      });

      if (!author) {
        throw new Error("Invalid token for changing password");
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
    } catch (e) {
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

  let { md, html } = generatePost(PostTypes.Post);
  let title = "Welcome to Letterpad";

  const post = {
    title: "Welcome to Letterpad",
    md: md,
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
    md: pageContent.md,
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
    md_draft: "",
  };

  return { page, post };
}
