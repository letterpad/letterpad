import gql from "graphql-tag";

export const CREATE_POST = gql`
    mutation createPost($type: String!, $title: String!, $body: String) {
        createPost(type: $type, title: $title, body: $body) {
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

export const UPDATE_OPTIONS = gql`
    mutation updateOptions($options: [OptionInputType]) {
        updateOptions(options: $options) {
            id
            option
            value
        }
    }
`;

export const UPDATE_TAXONOMY = gql`
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
    mutation deletePosts($ids: String!) {
        deletePosts(ids: $ids) {
            ok
        }
    }
`;

export const UPDATE_AUTHOR = gql`
    mutation updateAuthor(
        $id: Int!
        $email: String
        $fname: String
        $lname: String
        $password: String
        $username: String
        $social: String
        $role_id: Int
    ) {
        updateAuthor(
            id: $id
            email: $email
            password: $password
            username: $username
            social: $social
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

export const UPDATE_POST_QUERY = gql`
    mutation updatePost(
        $id: Int!
        $title: String!
        $body: String
        $status: String!
        $excerpt: String
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
                }
            }
        }
    }
`;

export const INSERT_MEDIA = gql`
    mutation insertMedia($url: String!) {
        insertMedia(url: $url) {
            url
        }
    }
`;

export const DELETE_MEDIA = gql`
    mutation deleteMedia($id: Int!) {
        deleteMedia(id: $id) {
            ok
            id
        }
    }
`;

export const UPLOAD_COVER_IMAGE = gql`
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
