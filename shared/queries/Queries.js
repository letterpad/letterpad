const gql = require("graphql-tag");
const { PostFragment } = require("./Fragments");

module.exports.GET_POSTS = gql`
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

module.exports.GET_SINGLE_POST = gql`
    query getPost($id: Int!) {
        post(id: $id) {
            ...postFields
            mdBody
        }
    }
    ${PostFragment}
`;

module.exports.GET_POST_BY_SLUG = gql`
    query singlePost($type: String, $slug: String) {
        post(type: $type, slug: $slug) {
            ...postFields
        }
    }
    ${PostFragment}
`;

module.exports.GET_PAGE_NAMES = gql`
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

module.exports.GET_MEDIA = gql`
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

module.exports.GET_AUTHORS = gql`
    query getAuthors {
        authors {
            id
            email
            fname
            lname
            username
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

module.exports.GET_AUTHOR = gql`
    query getAuthor($id: Int!) {
        author(id: $id) {
            id
            username
            email
            fname
            lname
            social
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

module.exports.GET_ROLES = gql`
    query getRoles {
        roles {
            id
            name
        }
    }
`;
module.exports.GET_OPTIONS = gql`
    query getOptions {
        settings {
            id
            option
            value
        }
    }
`;

module.exports.GET_TAXONOMIES = gql`
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
            desc
            slug
        }
    }
`;

module.exports.SEARCH_POSTS = gql`
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

module.exports.SEARCH_POSTS_BY_TAXONOMY = gql`
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

module.exports.BLOG_STATS = gql`
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

module.exports.TAX_SUGGESTIONS = gql`
    query getTaxonomies($type: String!) {
        taxonomies(type: $type) {
            id
            name
        }
    }
`;

module.exports.GET_POSTS_LINKED_TAXONOMIES = gql`
    query getTaxonomies($type: String!, $postType: String) {
        activeTaxonomies(type: $type, postType: $postType) {
            id
            name
            type
            slug
        }
    }
`;

module.exports.GET_LATEST_PUBLISHED_POSTS = gql`
    query latestPosts($type: String, $limit: Int) {
        posts(type: $type, offset: 0, limit: $limit) {
            count
            rows {
                id
                title
                type
                slug
                created_at
                published_at
                cover_image
            }
        }
    }
`;

module.exports.CAT_POSTS = gql`
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

module.exports.PAGE_MENU = gql`
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

module.exports.ADJACENT_POSTS = gql`
    query adjacentPosts($slug: String) {
        adjacentPosts(type: "post", slug: $slug) {
            next {
                title
                slug
                cover_image
                published_at
            }
            previous {
                title
                slug
                cover_image
                published_at
            }
        }
    }
`;
