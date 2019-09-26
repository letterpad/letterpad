export default `
  type Mutation {
    sendMail(to: String!, subject: String, body: String): Boolean
  }
`;
