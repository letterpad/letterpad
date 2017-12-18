export default `
  type Taxonomy {
    id: Int
    name: String
    type: String
  }

  type Query {
    taxonomies(type: String, name: String): [Taxonomy]
  }

`;
