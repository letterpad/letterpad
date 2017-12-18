import gql from "graphql-tag";

export const GET_POSTS = gql`
    query getPosts($type: String!, $offset: Int, $limit: Int) {
        posts(type: $type, offset: $offset, limit: $limit) {
            count
            rows {
                id
                title
                body
                author {
                    username
                }
                status
                created_at
                excerpt
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;

export const GET_SINGLE_POST = gql`
    query getPost($id: Int!) {
        post(id: $id) {
            id
            title
            body
            author {
                username
            }
            status
            created_at
            cover_image
            excerpt
            slug
            taxonomies {
                id
                name
                type
            }
        }
    }
`;

export const GET_PAGE_NAMES = gql`
    query getPosts($type: String!) {
        posts(type: $type) {
            count
            rows {
                id
                title
                slug
            }
        }
    }
`;
export const GET_MEDIA = gql`
    query getMedia($author_id: Int!, $offset: Int, $limit: Int) {
        media(author_id: $author_id, offset: $offset, limit: $limit) {
            count
            rows {
                id
                url
                created_at
            }
        }
    }
`;

export const GET_AUTHORS = gql`
    query getAuthors {
        authors {
            username
            role {
                name
                permissions {
                    name
                }
            }
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
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
        }
    }
`;
