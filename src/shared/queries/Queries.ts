import gql from "graphql-tag";
import { PostFragment } from "./Fragments";

export const QUERY_POSTS = gql`
  query posts($filters: PostFilters) {
    posts(filters: $filters) {
      count
      rows {
        ...postFields
      }
    }
  }
  ${PostFragment}
`;

export const QUERY_POST = gql`
  # TODO: Convert the below params to object.
  query post($filters: SinglePostFilters) {
    post(filters: $filters) {
      ...postFields
    }
  }
  ${PostFragment}
`;

export const QUERY_MEDIA = gql`
  query media($filters: MediaFilters) {
    media(filters: $filters) {
      count
      rows {
        id
        url
        authorId
        createdAt
        name
        description
      }
    }
  }
`;

export const QUERY_AUTHORS = gql`
  query authors {
    authors {
      id
      email
      fname
      lname
      username
      avatar
      bio
      social {
        github
        facebook
        twitter
        instagram
      }
      role {
        name
        permissions {
          name
        }
      }
    }
  }
`;

export const QUERY_AUTHOR = gql`
  query author($id: Int!) {
    author(id: $id) {
      id
      username
      email
      fname
      lname
      social {
        facebook
        instagram
        github
        twitter
      }
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

export const QUERY_ROLES = gql`
  query roles {
    roles {
      id
      name
    }
  }
`;

export const QUERY_SETTINGS = gql`
  query settings {
    settings {
      id
      option
      value
    }
  }
`;

export const QUERY_TAXONOMIES = gql`
  query taxonomies($type: TaxonomyTypes!) {
    taxonomies(type: $type) {
      id
      name
      desc
      slug
      type
    }
  }
`;

// export const QUERY_SEARCH_POSTS = gql`
//   query searchPosts(
//     $type: String
//     $query: String!
//     $offset: Int
//     $limit: Int
//     $status: String
//   ) {
//     posts(
//       body: $query
//       offset: $offset
//       limit: $limit
//       type: $type
//       status: $status
//     ) {
//       count
//       rows {
//         ...postFields
//       }
//     }
//   }
//   ${PostFragment}
// `;

// export const QUERY_SEARCH_POSTS_FUZY = gql`
//   query searchPosts($query: String!) {
//     search(query: $query) {
//       count
//       rows {
//         id
//         title
//         excerpt
//         publishedAt
//         slug
//       }
//     }
//   }
// `;

// export const QUERY_SEARCH_POSTS_BY_TAXONOMY = gql`
//   query postsByTaxSlug(
//     $type: String!
//     $slug: String!
//     $postType: String
//     $offset: Int
//     $limit: Int
//   ) {
//     postsByTaxSlug(
//       type: $type
//       slug: $slug
//       postType: $postType
//       offset: $offset
//       limit: $limit
//     ) {
//       count
//       posts {
//         ...postFields
//       }
//     }
//   }
//   ${PostFragment}
// `;

export const QUERY_STATS = gql`
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

export const QUERY_THEMES = gql`
  query themes($name: String) {
    themes(name: $name) {
      name
      settings {
        name
        type
        tag
        defaultValue
        changedValue
        helpText
        label
        placeholder
        options
      }
    }
  }
`;

// export const QUERY_TAX_SUGGESTIONS = gql`
//   query taxonomies($type: String) {
//     taxonomies(type: $type) {
//       id
//       name
//       type
//     }
//   }
// `;

// export const QUERY_GET_POSTS_LINKED_TAXONOMIES = gql`
//   query getTaxonomies($type: String!, $postType: String) {
//     activeTaxonomies(type: $type, postType: $postType) {
//       id
//       name
//       type
//       slug
//     }
//   }
// `;

// export const QUERY_GET_LATEST_PUBLISHED_POSTS = gql`
//   query latestPosts($type: String, $limit: Int) {
//     posts(type: $type, offset: 0, limit: $limit) {
//       count
//       rows {
//         id
//         title
//         type
//         slug
//         createdAt
//         publishedAt
//         cover_image
//       }
//     }
//   }
// `;

export const QUERY_ADJACENT_POSTS = gql`
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

export const QUERY_IS_AUTHORIZED = gql`
  query validateToken {
    validateToken {
      ok
      errors {
        message
      }
    }
  }
`;
