import gql from "graphql-tag";

export const CREATE_POST = gql`
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

export const UPDATE_AUTHOR = gql`
    mutation updateAuthor(
        $id: Int!
        $email: String
        $fname: String
        $lname: String
        $password: String
        $username: String
        $social: String
    ) {
        updateAuthor(
            id: $id
            email: $email
            password: $password
            username: $username
            social: $social
            fname: $fname
            lname: $lname
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
    ) {
        updatePost(
            id: $id
            title: $title
            body: $body
            status: $status
            excerpt: $excerpt
            taxonomies: $taxonomies
            slug: $slug
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
