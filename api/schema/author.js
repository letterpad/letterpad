export default `
  type Author {
    id: Int
    username: String
    email: String
    fname: String
    lname: String
    social: String
    role: Role
    bio: String
    avatar: String
  }

  type LoginResponse {
    ok: Boolean!
    token: String
    data: Author
    errors: [Error!]
  }

  type ForgotPasswordResponse {
    ok: Boolean!
    msg: String
  }

  type AuthorResponse {
    ok: Boolean!
    errors: [Error!]
    data: Author
  }

  type CreateAuthorResponse {
    ok: Boolean!
    errors: [Error!]
  }

  type Query {
    author(id: Int!, username: String): Author
    authors: [Author]
    me: Author
  }

  type Mutation {
    register(username: String!, password: String!, email: String!): AuthorResponse!
    login(username: String, email: String, password: String!, remember: Boolean): LoginResponse!
    forgotPassword(email: String!): ForgotPasswordResponse!
    resetPassword(password: String!, token: String!): ForgotPasswordResponse!
    updateAuthor(id: Int!, username: String, email: String, fname: String, lname: String, bio: String, social: String, password: String, role_id: Int, avatar: String): AuthorResponse
    createAuthor(email: String!, fname: String, lname: String, role_id: Int): CreateAuthorResponse
  }
`;
