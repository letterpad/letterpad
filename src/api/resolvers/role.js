export default {
  Query: {
    roles: async (root, args, { models }) => {
      return models.Role.findAll();
    },
  },
  Role: {
    permissions: async role => {
      const permissions = await role.getPermissions();
      console.log(permissions);
      return permissions;
    },
  },
  // EnumPermissions: {
  //   READ_ONLY_POSTS: "READ_ONLY_POSTS",
  //   MANAGE_ALL_POSTS: "ANAGE_ALL_POSTS",
  //   MANAGE_USERS: "MANAGE_USERS",
  //   MANAGE_SETTINGS: "MANAGE_SETTINGS",
  // },
};
