export default `
  type Taxonomy {
    id: Int
    name: String
    type: String
    desc: String
    slug: String
  }
  type Query {
    taxonomies(type: String, name: String): [Taxonomy]
    postTaxonomies(type: String, postType: String): [Taxonomy]
  }
  type EditTaxResponse {
    ok: Boolean,
    id: Int,
    errors: [Error!]
  }
  type Mutation {
    updateTaxonomy(id: Int!, name: String, desc: String, type: String!, slug: String, edit: Boolean):EditTaxResponse
    deleteTaxonomy(id: Int!):EditTaxResponse
  }
`;
