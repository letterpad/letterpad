export default `
  type Author {
    id: Int
    username: String
    email: String
    fname: String
    lname: String
    social: String
    role: Role
  }

  type Query {
    author(id: Int, username: String): Author
    authors: [Author]
    me: Author
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    errors: [Error!]
  }

  type AuthorResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Mutation {
    register(username: String!, password: String!, email: String!): Author!
    login(username: String, email: String, password: String!): LoginResponse!
    updateAuthor(id: Int!, username: String, email: String, fname: String, lname: String, social: String, password: String): AuthorResponse
  }
`;
