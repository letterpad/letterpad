import gql from "graphql-tag";
import { PostFragment } from "./Fragments";

export const GET_POSTS = gql`
    query getPosts($type: String!, $offset: Int, $limit: Int, $status: String) {
        posts(type: $type, offset: $offset, limit: $limit, status: $status) {
            count
            rows {
                ...postFields
            }
        }
    }
    ${PostFragment}
`;

export const GET_SINGLE_POST = gql`
    query getPost($id: Int!) {
        post(id: $id) {
            ...postFields
            mdBody
        }
    }
    ${PostFragment}
`;

export const GET_POST_BY_SLUG = gql`
    query singlePost($type: String, $slug: String) {
        post(type: $type, slug: $slug) {
            ...postFields
        }
    }
    ${PostFragment}
`;

export const GET_PAGE_NAMES = gql`
    query getPosts($type: String!, $status: String) {
        posts(type: $type, status: $status) {
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
            id
            email
            fname
            lname
            username
            avatar
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
            social
            avatar
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
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
            desc
            slug
        }
    }
`;

export const SEARCH_POSTS = gql`
    query searchPosts(
        $type: String
        $query: String!
        $offset: Int
        $limit: Int
        $status: String
    ) {
        posts(
            body: $query
            offset: $offset
            limit: $limit
            type: $type
            status: $status
        ) {
            count
            rows {
                ...postFields
            }
        }
    }
    ${PostFragment}
`;

export const SEARCH_POSTS_BY_TAXONOMY = gql`
    query catPosts(
        $type: String
        $slug: String
        $postType: String
        $offset: Int
        $limit: Int
    ) {
        postsByTaxSlug(
            postType: $postType
            offset: $offset
            limit: $limit
            type: $type
            slug: $slug
        ) {
            count
            posts {
                ...postFields
            }
        }
    }
    ${PostFragment}
`;

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

export const TAX_SUGGESTIONS = gql`
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
        }
    }
`;

export const GET_POSTS_LINKED_TAXONOMIES = gql`
    query getTaxonomies($type: String!, $postType: String) {
        postTaxonomies(type: $type, postType: $postType) {
            id
            name
            type
            slug
        }
    }
`;

export const GET_LATEST_PUBLISHED_POSTS = gql`
    query latestPosts($type: String, $limit: Int) {
        posts(type: $type, offset: 0, limit: $limit) {
            count
            rows {
                id
                title
                type
                slug
                created_at
                cover_image
            }
        }
    }
`;

export const CAT_POSTS = gql`
    query allPosts(
        $type: String
        $slug: String
        $postType: String
        $offset: Int
        $limit: Int
    ) {
        postsMenu(
            postType: $postType
            limit: $limit
            offset: $offset
            type: $type
            slug: $slug
        ) {
            count
            posts {
                ...postFields
            }
        }
    }
    ${PostFragment}
`;

export const PAGE_MENU = gql`
    query pageMenu($slug: String, $postType: String) {
        pageMenu(slug: $slug, postType: $postType) {
            ok
            post {
                ...postFields
            }
            errors {
                message
            }
        }
    }
    ${PostFragment}
`;

export const ADJACENT_POSTS = gql`
    query adjacentPosts($slug: String) {
        adjacentPosts(type: "post", slug: $slug) {
            next {
                title
                slug
            }
            previous {
                title
                slug
            }
        }
    }
`;
