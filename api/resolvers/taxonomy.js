import { TaxonomyModel } from "../models";

export default {
    Query: {
        taxonomies: (root, args) => {
            return TaxonomyModel.findAll({ where: args });
        }
    }
};
