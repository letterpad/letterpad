const gql = require("graphql-tag");

module.exports.CREATE_POST = gql`
    mutation createPost($type: String!) {
        createPost(type: $type) {
            ok
            errors {
                path
                message
            }
            post {
                id
                title
                body
                author {
                    username
                }
                status
                type
                slug
                mode
                excerpt
                created_at
                cover_image
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;

module.exports.UPDATE_OPTIONS = gql`
    mutation updateOptions($options: [OptionInputType]) {
        updateOptions(options: $options) {
            id
            option
            value
        }
    }
`;

module.exports.INSERT_THEME_SETTINGS = gql`
    mutation insertThemeSettings(
        $name: String
        $value: String
        $settings: String
    ) {
        insertThemeSettings(name: $name, value: $value, settings: $settings)
    }
`;

module.exports.UPDATE_THEME_SETTINGS = gql`
    mutation updateThemeSettings(
        $name: String
        $value: String
        $settings: String
    ) {
        updateThemeSettings(name: $name, value: $value, settings: $settings)
    }
`;

module.exports.UPDATE_TAXONOMY = gql`
    mutation updateTaxonomy(
        $id: Int!
        $name: String
        $desc: String
        $type: String!
        $slug: String
        $edit: Boolean
    ) {
        updateTaxonomy(
            id: $id
            name: $name
            desc: $desc
            type: $type
            edit: $edit
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

module.exports.DELETE_TAXONOMY = gql`
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

module.exports.BULK_DELETE_POSTS = gql`
    mutation deletePosts($ids: String!) {
        deletePosts(ids: $ids) {
            ok
        }
    }
`;

module.exports.UPDATE_AUTHOR = gql`
    mutation updateAuthor(
        $id: Int!
        $email: String
        $fname: String
        $lname: String
        $password: String
        $username: String
        $social: String
        $avatar: String
        $role_id: Int
        $bio: String
    ) {
        updateAuthor(
            id: $id
            email: $email
            password: $password
            username: $username
            social: $social
            fname: $fname
            lname: $lname
            avatar: $avatar
            role_id: $role_id
            bio: $bio
        ) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

module.exports.CREATE_AUTHOR = gql`
    mutation createAuthor(
        $email: String!
        $fname: String
        $lname: String
        $role_id: Int
    ) {
        createAuthor(
            email: $email
            fname: $fname
            lname: $lname
            role_id: $role_id
        ) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

module.exports.UPDATE_POST_QUERY = gql`
    mutation updatePost(
        $id: Int!
        $title: String!
        $body: String
        $status: String!
        $excerpt: String
        $cover_image: String
        $taxonomies: [TaxonomyInputType]
        $slug: String!
        $mode: String
    ) {
        updatePost(
            id: $id
            title: $title
            body: $body
            status: $status
            excerpt: $excerpt
            taxonomies: $taxonomies
            slug: $slug
            mode: $mode
            cover_image: $cover_image
        ) {
            ok
            errors {
                path
                message
            }
            post {
                id
                title
                body
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
                mode
                created_at
                cover_image
                taxonomies {
                    id
                    name
                    type
                    slug
                }
            }
        }
    }
`;

module.exports.INSERT_MEDIA = gql`
    mutation insertMedia($url: String!) {
        insertMedia(url: $url) {
            url
            id
            created_at
        }
    }
`;

module.exports.DELETE_MEDIA = gql`
    mutation deleteMedia($ids: String!) {
        deleteMedia(ids: $ids) {
            ok
        }
    }
`;

module.exports.UPLOAD_COVER_IMAGE = gql`
    mutation uploadFile($cover_image: String!, $id: Int!) {
        uploadFile(cover_image: $cover_image, id: $id) {
            ok
            post {
                id
                cover_image
            }
        }
    }
`;

module.exports.UPDATE_MEDIA = gql`
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

module.exports.LOGIN_QUERY = gql`
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

module.exports.FORGOT_PASSWORD_QUERY = gql`
    mutation forgotPassword($email: String!) {
        forgotPassword(email: $email) {
            ok
            msg
        }
    }
`;
module.exports.RESET_PASSWORD_QUERY = gql`
    mutation resetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
            ok
            msg
        }
    }
`;
