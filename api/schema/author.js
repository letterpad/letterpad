import Role from "./Role";
const Author = `
  type Author {
    id: Int
    username: String
    email: String,
    role: Role
  }
`;

export default () => [Author, Role];
