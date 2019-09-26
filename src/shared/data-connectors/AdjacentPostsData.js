import { graphql } from "@apollo/react-hoc";
import { ADJACENT_POSTS } from "../../shared/queries/Queries";

export default graphql(ADJACENT_POSTS, {
  options: props => {
    return {
      variables: {
        slug: props.slug,
      },
    };
  },
  props: ({ data: { loading, adjacentPosts } }) => ({
    adjacentPosts,
    adjPostsLoading: loading,
  }),
});
