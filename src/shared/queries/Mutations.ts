import gql from "graphql-tag";

export const CREATE_POST = gql`
  mutation createPost($data: InputCreatePost) {
    createPost(data: $data) {
      ok
      errors {
        path
        message
      }
      post {
        id
        title
        md
        html
        author {
          username
        }
        status
        type
        slug
        excerpt
        featured
        createdAt
        publishedAt
        cover_image {
          src
          width
          height
        }
        tags {
          id
          name
          slug
        }
      }
    }
  }
`;

export const UPDATE_OPTIONS = gql`
  mutation updateOptions($options: [OptionInputType!]!) {
    updateOptions(options: $options) {
      site_title
      site_tagline
      site_email
      site_url
      site_footer
      site_description
      subscribe_embed
      social_twitter
      social_facebook
      social_instagram
      social_github
      displayAuthorInfo
      cloudinary_key
      cloudinary_name
      cloudinary_secret
      menu {
        label
        original_name
        slug
        type
      }
      css
      google_analytics
      locale
      theme
      disqus_id
      banner {
        src
        width
        height
      }
      site_logo {
        src
        width
        height
      }
      site_favicon {
        src
        width
        height
      }
    }
  }
`;

export const INSERT_THEME_SETTINGS = gql`
  mutation insertThemes($name: String!, $settings: [InputThemeSettings!]!) {
    insertThemes(name: $name, settings: $settings)
  }
`;

export const UPDATE_THEME_SETTINGS = gql`
  mutation updateThemes($name: String!, $settings: [InputThemeSettings!]!) {
    updateThemes(name: $name, settings: $settings)
  }
`;

export const UPDATE_TAXONOMY = gql`
  mutation updateTaxonomy(
    $id: Int!
    $name: String
    $desc: String
    $type: TaxonomyType!
    $slug: String
  ) {
    updateTaxonomy(
      id: $id
      name: $name
      desc: $desc
      type: $type
      slug: $slug
    ) {
      id
      ok
      errors {
        message
        path
      }
    }
  }
`;

export const DELETE_TAXONOMY = gql`
  mutation deleteTaxonomy($id: Int!) {
    deleteTaxonomy(id: $id) {
      id
      ok
      errors {
        message
        path
      }
    }
  }
`;

export const BULK_DELETE_POSTS = gql`
  mutation deletePosts($ids: [Int!], $deleteFromSystem: Boolean) {
    deletePosts(ids: $ids, deleteFromSystem: $deleteFromSystem) {
      ok
    }
  }
`;

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($author: InputAuthor!) {
    updateAuthor(author: $author) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const CREATE_AUTHOR = gql`
  mutation createAuthor(
    $email: String!
    $fname: String
    $lname: String
    $roleName: EnumRoles
  ) {
    createAuthor(
      email: $email
      fname: $fname
      lname: $lname
      roleName: $roleName
    ) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const UPDATE_POST_QUERY = gql`
  mutation updatePost($data: InputUpdatePost) {
    updatePost(data: $data) {
      ok
      errors {
        path
        message
      }
      post {
        id
        title
        md
        html
        author {
          username
          lname
          fname
          avatar
          bio
        }
        slug
        type
        status
        excerpt
        featured
        createdAt
        publishedAt
        cover_image {
          width
          height
          src
        }
        tags {
          id
          name
          slug
        }
      }
    }
  }
`;

export const INSERT_MEDIA = gql`
  mutation insertMedia($url: String!) {
    insertMedia(url: $url) {
      url
      id
      createdAt
    }
  }
`;

export const DELETE_MEDIA = gql`
  mutation deleteMedia($ids: [Int!]!) {
    deleteMedia(ids: $ids) {
      ok
    }
  }
`;

export const UPDATE_MEDIA = gql`
  mutation updateMedia($id: Int!, $name: String, $description: String) {
    updateMedia(id: $id, name: $name, description: $description) {
      ok
      errors {
        message
        path
      }
    }
  }
`;

export const LOGIN_QUERY = gql`
  mutation login($username: String!, $password: String!) {
    login(email: $username, password: $password) {
      ok
      token
      errors {
        message
        path
      }
    }
  }
`;

export const FORGOT_PASSWORD_QUERY = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
      msg
    }
  }
`;
export const RESET_PASSWORD_QUERY = gql`
  mutation resetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      ok
      msg
    }
  }
`;
