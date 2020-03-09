import { makeUrl, parseErrors } from "../../shared/util";

import SendMail from "../utils/mail";
import bcrypt from "bcryptjs";
import config from "../../config";
import { getEmailBody } from "../utils/common";
import jwt from "jsonwebtoken";
import { requiresAdmin } from "../utils/permissions";

const host = config.ROOT_URL + config.BASE_NAME;

export default {
  Query: {
    author: async (root, args, { user, models }) => {
      const author = await models.Author.findOne({ where: args });

      if (author) {
        author.social = JSON.parse(author.dataValues.social);
        if (!author.avatar.startsWith("http")) {
          author.avatar = host + author.avatar;
        }
      } else {
        if (!user || !user.id) {
          author.email = "xxx@xxx.com";
          author.password = "xxx_xxx_xxx";
        }
      }
      return author;
    },

    authors: async (root, args, { user, models }) => {
      const authors = await models.Author.findAll({ where: args });
      return authors.map(author => {
        author.avatar = host + author.avatar;
        if (!user || !user.id) {
          author.email = "xxx@xxx.com";
          author.password = "xxx_xxx_xxx";
        }
        return author;
      });
    },

    me: async (req, args, { user, models }) => {
      const author = await models.Author.findOne({ where: { id: user.id } });
      if (!user || !user.id) {
        author.email = "xxx@xxx.com";
        author.password = "xxx_xxx_xxx";
      }
      return author;
    },

    validateToken: requiresAdmin.createResolver(async () => {
      return {
        ok: true,
        errors: [],
      };
    }),
  },
  Mutation: {
    login: async (root, { email, password, remember }, { SECRET, models }) => {
      const author = await models.Author.findOne({ where: { email } });
      if (!author) {
        return {
          ok: false,
          token: "",
          errors: [
            {
              path: "Login",
              message: "We couldnt find this email.",
            },
          ],
        };
      }
      const valid = await bcrypt.compare(password, author.password);

      if (!valid) {
        return {
          ok: false,
          token: "",
          errors: [
            {
              path: "Login",
              message: "We couldn't authenticate your credentials",
            },
          ],
        };
      }
      let role = await models.Role.findOne({
        where: { id: author.RoleId },
      });
      const perms = await role.getPermissions();
      const permissionNames = perms.map(perm => perm.name); //test
      const expiresIn = remember ? "30d" : "1d";

      const token = jwt.sign(
        {
          email,
          id: author.id,
          role: role.name,
          permissions: permissionNames,
          name: author.fname,
          expiresIn,
        },
        SECRET,
        { expiresIn },
      );
      // response.cookie("id", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   maxAge: 1000 * 60 * 60 * 24 * 30, // 7 days
      // });
      return {
        ok: true,
        token,
        errors: [],
      };
    },
    register: async (root, args, { models }) => {
      const author = { ...args };
      try {
        const user = await models.Author.findOne({
          attributes: ["email"],
          where: { email: author.email },
        });
        if (user) {
          throw new Error("Email already exist");
        }

        author.password = await bcrypt.hash(author.password, 12);
        author.roleId = 1;
        const res = models.Author.create(author);

        return {
          ok: true,
          data: res,
          errors: [],
        };
      } catch (e) {
        return {
          ok: false,
          data: null,
          errors: [{ message: e.message, path: "Register" }],
        };
      }
    },
    updateAuthor: requiresAdmin.createResolver(
      async (root, args, { models }) => {
        try {
          const newArgs = { ...args.author };
          if (args.author.password) {
            newArgs.password = await bcrypt.hash(args.author.password, 12);
          }
          if (args.author.social) {
            newArgs.social = JSON.stringify(args.author.social);
          }
          await models.Author.update(newArgs, {
            where: { id: newArgs.id },
          });
          return {
            ok: true,
            errors: [],
          };
        } catch (e) {
          return {
            ok: false,
            errors: parseErrors(e),
          };
        }
      },
    ),
    createAuthor: requiresAdmin.createResolver(
      async (root, args, { models }) => {
        try {
          let { roleName, ...newArgs } = args;
          if (!roleName) {
            roleName = "READER";
          }
          const author = await models.Author.findOne({
            where: { email: newArgs.email },
          });
          if (author) {
            return {
              ok: false,
              errors: [
                {
                  message: "Email already exist",
                  path: "createAuthor",
                },
              ],
            };
          }
          const randomPassword = Math.random()
            .toString(36)
            .substr(2);

          newArgs.password = await bcrypt.hash(randomPassword, 12);

          const role = await models.Role.findOne({
            where: { name: roleName },
          });

          newArgs.roleId = role.id;

          await models.Author.create(newArgs, {
            where: { id: newArgs.id },
          });

          const variables = {
            name: newArgs.fname,
            email: newArgs.email,
            password: randomPassword,
            rolename: role.name,
          };
          const body = await getEmailBody("register", variables, models);
          try {
            const success = await SendMail({
              to: newArgs.email,
              subject: "Account Created",
              body,
            });
          } catch (e) {}

          return {
            ok: true,
            errors: [],
          };
        } catch (e) {
          return {
            ok: false,
            errors: parseErrors(e),
          };
        }
      },
    ),
    forgotPassword: async (root, args, { models }) => {
      try {
        const email = args.email;
        const token = Math.random()
          .toString(36)
          .substr(2);
        const author = await models.Author.findOne({
          where: { email },
        });
        if (!author) {
          throw new Error("Email does not exist");
        }
        await models.Author.update({ token }, { where: { id: author.id } });
        const link = makeUrl(["/admin/reset-password", token]);
        const role = await models.Role.findOne({
          where: { id: author.roleId },
        });

        const variables = {
          name: author.fname,
          email: args.email,
          link,
        };
        const body = await getEmailBody("password_reset", variables, models);
        const success = await SendMail({
          to: email,
          subject: "Password Reset",
          body,
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
    resetPassword: async (root, args, { models }) => {
      try {
        const token = args.token;
        const password = await bcrypt.hash(args.password, 12);
        const author = await models.Author.findOne({
          where: { token },
        });

        if (!author) {
          throw new Error("Invalid token for changing password");
        }
        await models.Author.update(
          { token: "", password },
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
  },
  Author: {
    role: author => author.getRole(),
  },
};
