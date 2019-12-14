export default {
  Query: {
    roles: async (root, args, { models }) => {
      return models.Role.findAll();
    },
  },
  Role: {
    permissions: async role => {
      const permissions = await role.getPermissions();
      return permissions;
    },
  },
};
