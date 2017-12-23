export default {
    Role: {
        permissions: role => {
            return role.getPermissions();
        }
    }
};
