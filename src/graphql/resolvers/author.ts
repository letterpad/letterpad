import {
  MutationResolvers,
  InputAuthor,
  QueryResolvers,
  Social,
} from "@/__generated__/__types__";
import bcrypt from "bcryptjs";
import { validateCaptcha } from "./helpers";
import { decodeToken, verifyToken } from "@/shared/token";
import { EmailTemplates } from "../types";
import logger from "@/shared/logger";
import { ResolverContext } from "../context";
import { mapAuthorToGraphql } from "./mapper";
import { onBoardUser } from "@/lib/onboard";
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
        message: "Email already exist. Did you forget your password ?",
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
    const newAuthor = await onBoardUser(authorData, setting);

    if (mailUtils.enqueueEmailAndSend && newAuthor) {
      await mailUtils.enqueueEmailAndSend({
        author_id: newAuthor.id,
        template_id: EmailTemplates.VERIFY_NEW_USER,
      });
    }
    if (newAuthor)
      return {
        ...newAuthor,
        __typename: "Author",
      };
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
  async updateAuthor(_root, args, { session, prisma, mailUtils }) {
    if (session?.user.id !== args.author.id) {
      return {
        ok: true,
        errors: [{ message: "No session", path: "updateAuthor resolver" }],
      };
    }
    try {
      const dataToUpdate = { ...args.author } as InputAuthorForDb & {
        verified?: boolean;
      };
      const newEmail =
        args.author.email && session.user.email !== args.author.email;

      if (args.author.password) {
        dataToUpdate.password = await bcrypt.hash(args.author.password, 12);
      }
      if (args.author.social) {
        dataToUpdate.social = JSON.stringify(args.author.social);
      }

      if (args.author.username) {
        const usernameExist = await prisma.author.findFirst({
          where: {
            username: args.author.username,
            id: {
              not: {
                equals: args.author.id,
              },
            },
          },
        });

        if (usernameExist) {
          return {
            ok: false,
            errors: [
              {
                message: "Username already exist",
                path: "updateAuthor resolver",
              },
            ],
          };
        }
      }

      if (newEmail) {
        const emailExist = await prisma.author.findFirst({
          where: {
            email: args.author.email,
            id: {
              not: {
                equals: args.author.id,
              },
            },
          },
        });

        if (emailExist) {
          return {
            ok: false,
            errors: [
              {
                message: "Email already exist",
                path: "updateAuthor resolver",
              },
            ],
          };
        }
        dataToUpdate.verified = false;
      }

      logger.info("Updating Author => ", dataToUpdate);

      const author = await prisma.author.update({
        data: dataToUpdate,
        where: { id: args.author.id },
      });
      if (newEmail) {
        if (mailUtils.enqueueEmailAndSend) {
          await mailUtils.enqueueEmailAndSend({
            template_id: EmailTemplates.VERIFY_CHANGED_EMAIL,
            author_id: author.id,
          });
        }
        await prisma.setting.update({
          data: {
            client_token: encryptEmail(args.author.email as string),
          },
          where: {
            author_id: args.author.id,
          },
        });
      }
      if (args.author.username) {
        await prisma.setting.update({
          data: {
            site_url: `https://${args.author.username}.letterpad.app`,
          },
          where: {
            author_id: author.id,
          },
        });
      }
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
      await prisma.author.update({
        data: {
          verify_attempt_left: (author.verify_attempt_left || 3) - 1,
        },
        where: {
          email: author.email,
        },
      });
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
        where: { email: authorEmail.email },
      });

      if (!author) {
        throw new Error("Sorry, we could not validate this request.");
      }
      const newPassword = await bcrypt.hash(args.password, 12);

      await prisma.author.update({
        data: {
          password: newPassword,
          verify_attempt_left: 3,
          verified: true,
        },
        where: { id: author.id },
      });

      return {
        ok: true,
        message: "Password changed successfully",
      };
    } catch (e: any) {
      return {
        ok: false,
        message: e.message,
      };
    }
  },
};

export default { Mutation, Author, Query };
