import { QueryResolvers, MutationResolvers } from "../type-defs.graphqls";
import { ResolverContext } from "../apollo";

const userProfile = {
  id: 1,
  title: "John Smith",
  html: "html",
  excerpt: "md",
  md: "md",
  md_draft: "md",
};

// const Query: Required<QueryResolvers<ResolverContext>> = {
//   async post(_parent, _args, _context, _info) {
//     const post = await _context.models.Post.findOne({
//       where: { id: 1 },
//     });
//     console.log("post.id :>> ", post.toJSON());
//     return post.toJSON();
//   },
// };

// const Mutation: Required<MutationResolvers<ResolverContext>> = {
//   // updateName(_parent, _args, _context, _info) {
//   //   userProfile.title = _args.title;
//   //   return userProfile;
//   // },
// };

export default {};
