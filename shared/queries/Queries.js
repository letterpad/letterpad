import gql from "graphql-tag";

export const GET_POSTS = gql`
    query getPosts($type: String!, $offset: Int, $limit: Int, $status: String) {
        posts(type: $type, offset: $offset, limit: $limit, status: $status) {
            count
            rows {
                id
                title
                body
                author {
                    fname
                    lname
                }
                type
                slug
                mode
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
                fname
                lname
                avatar
            }
            type
            status
            mode
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

export const GET_POST_BY_SLUG = gql`
    query singlePost($type: String, $slug: String) {
        post(type: $type, slug: $slug) {
            id
            title
            body
            status
            created_at
            excerpt
            mode
            cover_image
            author {
                fname
                lname
                avatar
            }
            taxonomies {
                id
                name
                type
                slug
            }
        }
    }
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
                id
                title
                body
                author {
                    fname
                    lname
                    avatar
                }
                type
                slug
                status
                created_at
                excerpt
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
                id
                title
                body
                type
                cover_image
                created_at
                slug
                excerpt
                author {
                    fname
                    lname
                    avatar
                }
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
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
                id
                title
                type
                cover_image
                created_at
                slug
                excerpt
                author {
                    fname
                    lname
                    avatar
                }
                taxonomies {
                    id
                    name
                    type
                }
            }
        }
    }
`;

export const PAGE_MENU = gql`
    query pageMenu($slug: String, $postType: String) {
        pageMenu(slug: $slug, postType: $postType) {
            ok
            post {
                id
                title
                body
                status
                created_at
                excerpt
                cover_image
                slug
                author {
                    fname
                    lname
                    avatar
                }
                taxonomies {
                    id
                    name
                    type
                }
            }
            errors {
                message
            }
        }
    }
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
