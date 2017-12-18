export default `
  type Media {
    id: Int
    author_id: Int
    url: String
    created_at: String
  }

  type MediaNode {
    count: Int,
    rows: [Media]
  }

  type Query {
    media(id: Int, author_id: Int!, offset: Int, limit: Int, cursor: Int): MediaNode
  }

  type Mutation {
    insertMedia(url: String): Media
    deleteMedia(id: Int!): Media
  }
`;
