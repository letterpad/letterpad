"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _taxonomy = require("../models/taxonomy");

exports.default = {
    Query: {
        taxonomies: function taxonomies(root, args, _ref) {
            var models = _ref.models;
            return models.Taxonomy.findAll({ where: args, order: [["name", "ASC"]] });
        },
        activeTaxonomies: function activeTaxonomies(root, args, _ref2) {
            var models = _ref2.models,
                user = _ref2.user;
            var postType = args.postType,
                type = args.type,
                taxId = args.taxId;


            var where = {};
            if (!user || !user.id) {
                where.status = "publish";
            }
            if (postType) {
                where.type = postType;
            }

            var query = {
                include: [{
                    model: models.Post,
                    as: "posts",
                    where: where,
                    required: true
                }],
                order: [["name", "ASC"]],
                where: { type: type },
                group: ["taxonomy_id", "post_id"]
            };
            if (taxId) {
                query.where.id = taxId;
            }
            if (args.slug) {
                query.where.slug = args.slug;
            }
            return models.Taxonomy.findAll(query);
        }
    },
    Mutation: {
        updateTaxonomy: async function updateTaxonomy(root, args, _ref3) {
            var models = _ref3.models;

            if (!args.edit) {
                var found = await models.Taxonomy.findOne({
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

                var item = await models.Taxonomy.create({
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
                var id = await models.Taxonomy.update({
                    name: args.name,
                    desc: args.desc,
                    type: args.type,
                    slug: args.slug
                }, {
                    where: { id: args.id }
                });

                return {
                    ok: true,
                    errors: [],
                    id: args.id
                };
            }
        },
        deleteTaxonomy: async function deleteTaxonomy(root, args, _ref4) {
            var models = _ref4.models;

            var destroy = models.Taxonomy.destroy({ where: { id: args.id } });
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