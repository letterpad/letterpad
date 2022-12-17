import gql from 'graphql-tag';

export const settingsFragment = gql`
  fragment settings on Query {
    settings {
      ... on Setting {
        __typename
        site_footer
        site_favicon {
          src
        }
        subscribe_embed
        css
        site_title
        site_email
        site_description
        site_tagline
        show_about_page
        show_tags_page
        theme
        site_url
        banner {
          src
        }
        site_logo {
          src
          width
          height
        }
        menu {
          type
          slug
          label
        }
      }
    }
  }
`;
export const meFragment = gql`
  fragment me on Query {
    me {
      ... on Author {
        __typename
        name
        bio
        occupation
        avatar
        company_name
        analytics_uuid
        social {
          twitter
          facebook
          github
          instagram
          linkedin
        }
      }
    }
  }
`;

export const pageFragment = gql`
  fragment pageFragment on Post {
    ... on Post {
      id
      slug
      title
      reading_time
      page_type
      page_data
      html
      type
      publishedAt
      updatedAt
      excerpt
      stats {
        words
        reading_time
        characters
        spaceless_characters
      }
      tags {
        ... on TagsNode {
          rows {
            name
            slug
          }
          __typename
        }
      }
      author {
        ... on Author {
          id
          name
          bio
          avatar
          occupation
          __typename
        }
      }
      cover_image {
        src
      }
    }
    __typename
  }
`;

export const postsFragment = gql`
  fragment postsFragment on PostsNode {
    __typename
    ... on PostsNode {
      count
      rows {
        id
        title
        slug
        cover_image {
          src
        }
        author {
          ... on Author {
            name
            avatar
            bio
            __typename
          }
        }
        stats {
          words
          reading_time
          characters
          spaceless_characters
        }
        publishedAt
        reading_time
        excerpt
        tags {
          ... on TagsNode {
            rows {
              name
              slug
            }
            __typename
          }
        }
      }
    }
  }
`;

export const pageQuery = gql`
  query PageQuery($slug: String) {
    post(filters: { slug: $slug }) {
      ...pageFragment
      __typename
    }
  }
  ${pageFragment}
`;

export const postsQuery = gql`
  query postsQuery($tagSlug: String!) {
    posts(filters: { tagSlug: $tagSlug }) {
      ...postsFragment
    }
  }
  ${postsFragment}
`;

export const tagsFragment = gql`
  fragment tagsFragment on TagResponse {
    ... on Tag {
      name
      slug
    }
    ... on Exception {
      message
    }
  }
`;

export const sitemapFragment = gql`
  fragment sitemapFragment on SiteMapResponse {
    ... on SiteMapList {
      rows {
        route
        priority
        lastmod
      }
    }
    ... on SiteMapError {
      message
    }
    __typename
  }
`;

export const feedFragment = gql`
  fragment feedFragment on FeedResponse {
    ... on Feed {
      rows {
        guid
        title
        link
        description
        pubDate
        author
        categories
      }
    }
    ... on FeedError {
      message
    }
    __typename
  }
`;
