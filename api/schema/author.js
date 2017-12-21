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
    me: Author
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    errors: [Error!]
  }

  type Mutation {
    register(username: String!, password: String!, email: String!): Author!
    login(username: String, email: String, password: String!): LoginResponse!
  }
`;
