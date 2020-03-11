const gql = require("graphql-tag");

export const PostFragment = gql`
  fragment postFields on Post {
    id
    title
    md
    html
    status
    createdAt
    publishedAt
    updatedAt
    excerpt
    cover_image {
      width
      height
      src
    }
    slug
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
