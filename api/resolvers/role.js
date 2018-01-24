export default {
    Query: {
        roles: (root, args, { models }) => {
            return models.Role.findAll();
        }
    },
    Role: {
        permissions: role => {
            return role.getPermissions();
        }
    }
};
