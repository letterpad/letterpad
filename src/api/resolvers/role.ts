import { RoleResolvers, QueryResolvers } from "./../../__generated__/resolvers";

interface IRoleResolver {
  Query: QueryResolvers;
  Role: RoleResolvers;
}
const RoleResolver: IRoleResolver = {
  Query: {
    // @ts-ignore: Relationship
    roles: async (_root, _args, { models }) => {
      const dbResult = await models.Role.findAll();
      return dbResult;
    },
  },
  Role: {
    permissions: async role => {
      // @ts-ignore: Relationship
      const permissions = await role.getPermissions();
      return permissions;
    },
  },
};
export default RoleResolver;
