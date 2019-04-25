export default `
  type Media {
    id: Int
    author_id: Int
    url: String
    createdAt: String
    name: String
    description: String
  }

  type MediaNode {
    count: Int,
    rows: [Media]
  }

  type DeleteResponse {
    ok: Boolean!
  }

  type UpdateResponse {
    ok: Boolean!
    errors: [Error]
  }

  input Upload {
    name: String!
    type: String!
    size: Int!
    path: String!
  }
  
  type Query {
    media(id: Int, author_id: Int!, offset: Int, limit: Int, cursor: Int): MediaNode
  }

  type Mutation {
    insertMedia(url: String): Media
    deleteMedia(ids: String!): DeleteResponse
    updateMedia(id: Int!, name: String, description: String): UpdateResponse
  }
`;
