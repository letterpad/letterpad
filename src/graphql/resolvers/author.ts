import {
  InputAuthor,
  QueryResolvers,
} from "../../../__generated__/src/graphql/type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { MutationResolvers } from "../../../__generated__/src/graphql/type-defs.graphqls";
import models from "../db/models";
import bcrypt from "bcryptjs";
import { getModifiedSession } from "./helpers";
import config from "../../../config";

const host = config.ROOT_URL + config.BASE_NAME;

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
  async me(_parent, _args, context, _info) {
    const session = await getModifiedSession(context);
    if (!session) {
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
        author.avatar = host + author.avatar;
      }
    }
    return author
      ? { ...author, __typename: "Author" }
      : { __typename: "AuthorNotFoundError", message: "" };
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
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
  async updateAuthor(_root, args, context) {
    const session = await getModifiedSession(context);
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
