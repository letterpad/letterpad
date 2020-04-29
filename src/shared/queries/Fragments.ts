const gql = require("graphql-tag");

export const PostFragmentAllFields = gql`
  fragment postFields on Post {
    id
    title
    md
    md_draft
    html
    status
    createdAt
    publishedAt
    scheduledAt
    updatedAt
    excerpt
    reading_time
    featured
    cover_image {
      width
      height
      src
    }
    slug
    type
    author {
      name
      avatar
      bio
    }
    tags {
      id
      name
      slug
    }
  }
`;
