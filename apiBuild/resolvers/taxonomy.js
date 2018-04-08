"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _taxonomy = require("../models/taxonomy");

(function () {
    var enterModule = require('react-hot-loader').enterModule;

    enterModule && enterModule(module);
})();

var _default = {
    Query: {
        taxonomies: function taxonomies(root, args, _ref) {
            var models = _ref.models;
            return models.Taxonomy.findAll({ where: args, order: [["name", "ASC"]] });
        },
        postTaxonomies: function postTaxonomies(root, args, context) {
            return (0, _taxonomy.getTaxonomies)(root, args, context);
        }
    },
    Mutation: {
        updateTaxonomy: async function updateTaxonomy(root, args, _ref2) {
            var models = _ref2.models;

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
        deleteTaxonomy: async function deleteTaxonomy(root, args, _ref3) {
            var models = _ref3.models;

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
exports.default = _default;
;

(function () {
    var reactHotLoader = require('react-hot-loader').default;

    var leaveModule = require('react-hot-loader').leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(_default, "default", "api/resolvers/taxonomy.js");
    leaveModule(module);
})();

;