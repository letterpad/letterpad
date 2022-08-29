import {
  AuthorResolvers,
  MutationResolvers,
  QueryResolvers,
} from "@/__generated__/__types__";
import { ResolverContext } from "@/graphql/context";

import { getSocialLink } from "./helpers";
import {
  createAuthor,
  forgotPassword,
  getAuthor,
  getPermissionFromAuthor,
  getRoleFromAuthor,
  resetPassword,
  updateAuthor,
} from "../services/author";
import { loginAuthor } from "../services/author/loginAuthor";

const Author: AuthorResolvers<ResolverContext> = {
  role: async ({ id }, _args, context) => getRoleFromAuthor(id, context),
  permissions: async ({ id }, _args, context) =>
    getPermissionFromAuthor(id, context),
  social: ({ social = {} }) => {
    if (typeof social === "string") {
      return getSocialLink(JSON.parse(social));
    }
    return social;
  },
};

const Query: QueryResolvers<ResolverContext> = {
  async me(_parent, _args, context) {
    return getAuthor(_args, context);
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async createAuthor(_, args, context) {
    return createAuthor(args, context);
  },
  async login(_parent, args, context) {
    return loginAuthor(args, context);
  },
  async updateAuthor(_root, args, context) {
    return updateAuthor(args, context);
  },
  async forgotPassword(_root, args, context) {
    return forgotPassword(args, context);
  },
  async resetPassword(_root, args, context) {
    return resetPassword(args, context);
  },
};

export default { Mutation, Author, Query };
