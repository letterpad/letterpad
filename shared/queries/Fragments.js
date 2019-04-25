const gql = require("graphql-tag");

module.exports.PostFragment = gql`
  fragment postFields on Post {
    id
    title
    body
    status
    createdAt
    published_at
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
