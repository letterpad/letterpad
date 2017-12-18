export default `
  type Author {
    id: Int
    username: String
    email: String,
    role: Role
  }

  type Query {
    author(username: String!): Author
    authors: [Author]
  }

`;
