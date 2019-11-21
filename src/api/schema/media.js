export default `
  type Media {
    id: Int
    authorId: Int
    url: String
    createdAt: Date
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


  
  type Query {
    media(id: Int, authorId: Int!, offset: Int, limit: Int, cursor: Int): MediaNode
  }

  type Mutation {
    insertMedia(url: String): Media
    deleteMedia(ids: String!): DeleteResponse
    updateMedia(id: Int!, name: String, description: String): UpdateResponse
  }
`;
