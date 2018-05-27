"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n  type Taxonomy {\n    id: Int\n    name: String\n    type: String\n    desc: String\n    slug: String\n  }\n  type Query {\n    taxonomies(type: String, name: String): [Taxonomy]\n    activeTaxonomies(type: String, postType: String): [Taxonomy]\n  }\n  type EditTaxResponse {\n    ok: Boolean,\n    id: Int,\n    errors: [Error!]\n  }\n  type Mutation {\n    updateTaxonomy(id: Int!, name: String, desc: String, type: String!, slug: String, edit: Boolean):EditTaxResponse\n    deleteTaxonomy(id: Int!):EditTaxResponse\n  }\n";