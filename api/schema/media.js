export default `
  type Media {
    id: Int
    author_id: Int
    url: String
    created_at: String
    name: String
    description: String
  }

  type MediaNode {
    count: Int,
    rows: [Media]
  }

  type DeleteResponse {
    ok: Boolean!
    id: Int
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
    deleteMedia(id: Int!): DeleteResponse
    updateMedia(id: Int!, name: String, description: String): UpdateResponse
  }
`;
