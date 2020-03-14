import { PostFragmentAllFields } from "./Fragments";
import gql from "graphql-tag";

export const QUERY_POSTS = gql`
  query posts($filters: PostsFilters) {
    posts(filters: $filters) {
      count
      rows {
        ...postFields
      }
    }
  }
  ${PostFragmentAllFields}
`;

export const QUERY_POST = gql`
  # TODO: Convert the below params to object.
  query post($filters: PostFilters) {
    post(filters: $filters) {
      ...postFields
    }
  }
  ${PostFragmentAllFields}
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
  query taxonomies($filters: TaxonomyFilters) {
    taxonomies(filters: $filters) {
      id
      name
      desc
      slug
      type
    }
  }
`;

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

export const QUERY_ADJACENT_POSTS = gql`
  query adjacentPosts($slug: String) {
    adjacentPosts(slug: $slug) {
      next {
        title
        slug
        cover_image {
          width
          height
          src
        }
        publishedAt
      }
      previous {
        title
        slug
        cover_image {
          width
          height
          src
        }
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
