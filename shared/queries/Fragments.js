const gql = require("graphql-tag");

module.exports.PostFragment = gql`
    fragment postFields on Post {
        id
        title
        body
        mdPreview
        status
        created_at
        excerpt
        cover_image
        slug
        mode
        type
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
`;
