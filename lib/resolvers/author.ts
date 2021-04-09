import { QueryResolvers, MutationResolvers } from "../type-defs.graphqls";
import { ResolverContext } from "../apollo";

const Query: QueryResolvers<ResolverContext> = {
  async login(_parent, args, context, _info) {
    const author = await context?.models?.Author.findOne({
      logging: console.log,
      where: { email: args.data?.email, password: args.data?.password },
    });
    if (author) {
      const role = await author.getRole();
      return {
        status: true,
        data: {
          ...author,
          social: JSON.parse(author.social as string),
          role: role ? role.name : "Guest",
        },
      };
    }

    return { status: false, data: {} };
  },
};

// const Mutation: Required<MutationResolvers<ResolverContext>> = {
//   // updateName(_parent, _args, _context, _info) {
//   //   userProfile.title = _args.title;
//   //   return userProfile;
//   // },
// };

export default { Query };
