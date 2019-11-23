const gql = require("graphql-tag");
const { PostFragment } = require("./Fragments");

module.exports.GET_POSTS = gql`
  query posts($filters: PostFiltersWithPagination) {
    posts(filters: $filters) {
      count
      rows {
        ...postFields
      }
    }
  }
  ${PostFragment}
`;

module.exports.GET_SINGLE_POST = gql`
  # TODO: Convert the below params to object.
  query post($filters: SinglePostFilters) {
    post(filters: $filters) {
      ...postFields
    }
  }
  ${PostFragment}
`;

module.exports.GET_POST_BY_SLUG = gql`
  query singlePost($type: String, $slug: String) {
    post(type: $type, slug: $slug) {
      ...postFields
    }
  }
  ${PostFragment}
`;

module.exports.GET_MEDIA = gql`
  query getMedia($authorId: Int!, $offset: Int, $limit: Int) {
    media(authorId: $authorId, offset: $offset, limit: $limit) {
      count
      rows {
        id
        url
        createdAt
        name
        description
      }
    }
  }
`;

module.exports.GET_AUTHORS = gql`
  query getAuthors {
    authors {
      id
      email
      fname
      lname
      username
      avatar
      bio
      role {
        name
        permissions {
          name
        }
      }
    }
  }
`;

module.exports.GET_AUTHOR = gql`
  query getAuthor($id: Int!) {
    author(id: $id) {
      id
      username
      email
      fname
      lname
      social
      avatar
      bio
      role {
        name
        permissions {
          name
        }
      }
    }
  }
`;

module.exports.GET_ROLES = gql`
  query getRoles {
    roles {
      id
      name
    }
  }
`;
module.exports.GET_OPTIONS = gql`
  query getOptions {
    settings {
      id
      option
      value
    }
  }
`;

module.exports.GET_TAXONOMIES = gql`
  query getTaxonomies($type: String!) {
    taxonomies(type: $type) {
      id
      name
      desc
      slug
    }
  }
`;

module.exports.SEARCH_POSTS = gql`
  query searchPosts(
    $type: String
    $query: String!
    $offset: Int
    $limit: Int
    $status: String
  ) {
    posts(
      body: $query
      offset: $offset
      limit: $limit
      type: $type
      status: $status
    ) {
      count
      rows {
        ...postFields
      }
    }
  }
  ${PostFragment}
`;

module.exports.SEARCH_POSTS_FUZY = gql`
  query searchPosts($query: String!) {
    search(query: $query) {
      count
      rows {
        id
        title
        excerpt
        publishedAt
        slug
      }
    }
  }
`;

module.exports.SEARCH_POSTS_BY_TAXONOMY = gql`
  query catPosts(
    $type: String!
    $slug: String!
    $postType: String
    $offset: Int
    $limit: Int
  ) {
    postsByTaxSlug(
      type: $type
      slug: $slug
      postType: $postType
      offset: $offset
      limit: $limit
    ) {
      count
      posts {
        ...postFields
      }
    }
  }
  ${PostFragment}
`;

module.exports.BLOG_STATS = gql`
  query stats {
    stats {
      posts {
        published
        drafts
      }
      pages {
        published
        drafts
      }
      tags
      categories
    }
  }
`;

module.exports.THEME_SETTINGS = gql`
  query themeSettings($name: String) {
    themeSettings(name: $name) {
      name
      value
      settings
    }
  }
`;

module.exports.TAX_SUGGESTIONS = gql`
  query getTaxonomies($type: String) {
    taxonomies(type: $type) {
      id
      name
      type
    }
  }
`;

module.exports.GET_POSTS_LINKED_TAXONOMIES = gql`
  query getTaxonomies($type: String!, $postType: String) {
    activeTaxonomies(type: $type, postType: $postType) {
      id
      name
      type
      slug
    }
  }
`;

module.exports.GET_LATEST_PUBLISHED_POSTS = gql`
  query latestPosts($type: String, $limit: Int) {
    posts(type: $type, offset: 0, limit: $limit) {
      count
      rows {
        id
        title
        type
        slug
        createdAt
        publishedAt
        cover_image
      }
    }
  }
`;

module.exports.POSTS_FROM_CATEGORY_SLUG = gql`
  query menuContent($filters: MenuFiltersWithPagination) {
    menuContent(filters: $filters) {
      count
      rows {
        ...postFields
      }
    }
  }
  ${PostFragment}
`;

module.exports.ADJACENT_POSTS = gql`
  query adjacentPosts($slug: String) {
    adjacentPosts(slug: $slug) {
      next {
        title
        slug
        cover_image
        publishedAt
      }
      previous {
        title
        slug
        cover_image
        publishedAt
      }
    }
  }
`;

module.exports.IS_AUTHORIZED = gql`
  query validateToken {
    validateToken {
      ok
      errors {
        message
      }
    }
  }
`;
