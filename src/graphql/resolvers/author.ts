import {
  InputAuthor,
  QueryResolvers,
} from "@/__generated__/type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { MutationResolvers } from "@/__generated__/type-defs.graphqls";
import models from "../db/models";
import bcrypt from "bcryptjs";
import { settingsData } from "../db/models/setting";

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
  async createAuthor(_, args, context) {
    if (args.data.token) {
      const response = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY}&response=${args.data.token}`,
      ).then(res => res.json());

      if (!response.success) {
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
      });
      await newAuthor.setSetting(setting);

      return newAuthor;
    }
    return {
      __typename: "CreateAuthorError",
      message: "Something went wrong and we dont know what.",
    };
  },
  async login(_parent, args, _context, _info) {
    const author = await models.Author.findOne({
      where: { email: args.data?.email, password: args.data?.password },
    });
    if (author) {
      try {
        // const role = await author.getRole();
        // const per = await role.getPermissions();
        // const permArr = per.map(p => p.name) as Permissions[];
        return {
          status: true,
          data: {
            ...author,
            social: JSON.parse(author.social as string),
            // role: role ? (role.name as Role) : Role.Reader,
            // permissions: permArr,
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
};

export default { Mutation, Author, Query };
