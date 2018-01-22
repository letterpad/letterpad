export default {
    Query: {
        taxonomies: (root, args, { models }) =>
            models.Taxonomy.findAll({ where: args, order: [["name", "ASC"]] })
    },
    Mutation: {
        updateTaxonomy: async (root, args, { models }) => {
            let found = await models.Taxonomy.findOne({
                where: { name: args.name, type: args.type }
            });

            if (found) {
                return {
                    ok: false,
                    errors: [{ message: "Already exist", path: "Taxonomy" }]
                };
            }
            if (args.id == 0) {
                //create

                let item = await models.Taxonomy.create({
                    name: args.name,
                    type: args.type
                });

                return {
                    ok: true,
                    errors: [],
                    id: item.id
                };
            } else {
                let id = await models.Taxonomy.update(
                    { name: args.name, type: args.type },
                    {
                        where: { id: args.id }
                    }
                );

                return {
                    ok: true,
                    errors: [],
                    id: args.id
                };
            }
        },
        deleteTaxonomy: async (root, args, { models }) => {
            const destroy = models.Taxonomy.destroy({ where: { id: args.id } });
            if (destroy) {
                return {
                    ok: true,
                    errors: [],
                    id: args.id
                };
            }
        }
    }
};
