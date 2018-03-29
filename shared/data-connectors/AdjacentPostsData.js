import { graphql } from "react-apollo";
import { ADJACENT_POSTS } from "../../shared/queries/Queries";

export default graphql(ADJACENT_POSTS, {
    options: props => {
        return {
            variables: {
                slug: props.match.params.slug
            }
        };
    },
    props: ({ data: { loading, adjacentPosts } }) => ({
        adjacentPosts,
        adjPostsLoading: loading
    })
});
