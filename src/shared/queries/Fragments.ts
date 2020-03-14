const gql = require("graphql-tag");

export const PostFragmentAllFields = gql`
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
    reading_time
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
