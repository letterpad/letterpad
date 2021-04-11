import { ResolverContext } from "../apollo";
import {
  MutationResolvers,
  Permissions,
  Role,
} from "../../__generated__/lib/type-defs.graphqls";
import models from "../../db/models";

const Author = {
  role: async author => {
    if (author.role) {
      return author.role;
    }
    try {
      const role = await author.getRole();
      return role.name;
    } catch (e) {
      throw new Error(e);
    }
  },
  permissions: async author => {
    if (author.permissions) {
      return author.permissions;
    }
    try {
      const role = await author.getRole();
      const permissions = await role.getPermissions();
      return permissions.map(p => p.name);
    } catch (e) {
      throw new Error(e);
    }
  },
};

const Mutation: MutationResolvers<ResolverContext> = {
  async login(_parent, args, _context, _info) {
    const author = await models.Author.findOne({
      where: { email: args.data?.email, password: args.data?.password },
    });
    if (author) {
      const role = await author.getRole();
      const per = await role.getPermissions();
      const permArr = per.map(p => p.name) as Permissions[];
      return {
        status: true,
        data: {
          ...author,
          social: JSON.parse(author.social as string),
          role: role ? (role.name as Role) : Role.Reader,
          permissions: permArr,
        },
      };
    }

    return { status: false };
  },
};

export default { Mutation, Author };
