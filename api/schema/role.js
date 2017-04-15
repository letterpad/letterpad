import Permission from "./permission";
const Role = `
  type Role {
    id: Int
    name: String
    permissions: [Permission]
  }
`;

export default () => [Role, Permission];
