import { MutationResolvers, Role } from "../type-defs.graphqls";
import { ResolverContext } from "../apollo";
import { Permissions } from "../../__generated__/lib/type-defs.graphqls";

const Mutation: MutationResolvers<ResolverContext> = {
  async login(_parent, args, context, _info) {
    const author = await context?.models?.Author.findOne({
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

export default { Mutation };
