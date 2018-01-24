export default `
  type Role {
    id: Int
    name: String
    permissions: [Permission]
  }

  type Permission {
    id: Int
    name: String
  }

  type Query {
    roles: [Role]
  }
`;
