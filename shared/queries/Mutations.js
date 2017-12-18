import gql from "graphql-tag";

export const CREATE_POST = gql`
    mutation createPost($type: String!) {
        createPost(type: $type) {
            id
            title
            body
            author {
                username
            }
            status
            type
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
