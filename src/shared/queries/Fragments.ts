const gql = require("graphql-tag");

export const PostFragment = gql`
  fragment postFields on Post {
    id
    title
    body
    status
    createdAt
    publishedAt
    excerpt
    cover_image
    slug
    mode
    type
    author {
      fname
      lname
      avatar
      bio
    }
    taxonomies {
      id
      name
      type
      slug
    }
  }
`;
