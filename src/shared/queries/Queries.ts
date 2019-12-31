import gql from "graphql-tag";
import { PostFragment } from "./Fragments";

export const GET_POSTS = gql`
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

export const GET_SINGLE_POST = gql`
  # TODO: Convert the below params to object.
  query post($filters: SinglePostFilters) {
    post(filters: $filters) {
      ...postFields
    }
  }
  ${PostFragment}
`;

// export const GET_POST_BY_SLUG = gql`
//   query singlePost($type: String, $slug: String) {
//     post(type: $type, slug: $slug) {
//       ...postFields
//     }
//   }
//   ${PostFragment}
// `;

export const GET_MEDIA = gql`
  query media($filters: MediaFiltersWithPagination) {
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

export const GET_AUTHORS = gql`
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

export const GET_AUTHOR = gql`
  query getAuthor($id: Int!) {
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

export const GET_ROLES = gql`
  query getRoles {
    roles {
      id
      name
    }
  }
`;

export const GET_OPTIONS = gql`
  query getOptions {
    settings {
      id
      option
      value
    }
  }
`;

export const GET_TAXONOMIES = gql`
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

// export const SEARCH_POSTS = gql`
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

// export const SEARCH_POSTS_FUZY = gql`
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

// export const SEARCH_POSTS_BY_TAXONOMY = gql`
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

export const BLOG_STATS = gql`
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

export const THEME_SETTINGS = gql`
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

// export const TAX_SUGGESTIONS = gql`
//   query getTaxonomies($type: String) {
//     taxonomies(type: $type) {
//       id
//       name
//       type
//     }
//   }
// `;

// export const GET_POSTS_LINKED_TAXONOMIES = gql`
//   query getTaxonomies($type: String!, $postType: String) {
//     activeTaxonomies(type: $type, postType: $postType) {
//       id
//       name
//       type
//       slug
//     }
//   }
// `;

// export const GET_LATEST_PUBLISHED_POSTS = gql`
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

// export const POSTS_FROM_CATEGORY_SLUG = gql`
//   query menuContent($filters: MenuFiltersWithPagination) {
//     menuContent(filters: $filters) {
//       count
//       rows {
//         ...postFields
//       }
//     }
//   }
//   ${PostFragment}
// `;

export const ADJACENT_POSTS = gql`
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

export const IS_AUTHORIZED = gql`
  query validateToken {
    validateToken {
      ok
      errors {
        message
      }
    }
  }
`;
