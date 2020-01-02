import { graphql } from "@apollo/react-hoc";
import { QUERY_ADJACENT_POSTS } from "../../shared/queries/Queries";

export default graphql(QUERY_ADJACENT_POSTS, {
  options: (props: any) => {
    return {
      variables: {
        slug: props.slug,
      },
    };
  },
  props: ({ data: { loading, adjacentPosts } }: any) => ({
    adjacentPosts,
    adjPostsLoading: loading,
  }),
});
