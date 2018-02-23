import { getTaxonomies } from "../models/taxonomy";

export default {
    Query: {
        taxonomies: (root, args, { models }) =>
            models.Taxonomy.findAll({ where: args, order: [["name", "ASC"]] }),
        postTaxonomies: (root, args, context) => {
            return getTaxonomies(root, args, context);
        }
    },
    Mutation: {
        updateTaxonomy: async (root, args, { models }) => {
            if (!args.edit) {
                let found = await models.Taxonomy.findOne({
                    where: { name: args.name, type: args.type }
                });
                if (found) {
                    return {
                        ok: false,
                        id: null,
                        errors: [{ message: "Already exist", path: "Taxonomy" }]
                    };
                }
            }
            if (args.id == 0) {
                //create

                let item = await models.Taxonomy.create({
                    name: args.name,
                    desc: args.desc,
                    type: args.type,
                    slug: args.slug
                });

                return {
                    ok: true,
                    errors: [],
                    id: item.id
                };
            } else {
                let id = await models.Taxonomy.update(
                    {
                        name: args.name,
                        desc: args.desc,
                        type: args.type,
                        slug: args.slug
                    },
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
