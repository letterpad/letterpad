export default {
    Query: {
        taxonomies: (root, args, { models }) =>
            models.Taxonomy.findAll({ where: args })
    }
};
