import { graphql } from "@apollo/react-hoc";
import { GET_LATEST_PUBLISHED_POSTS } from "../queries/Queries";

export default graphql(GET_LATEST_PUBLISHED_POSTS, {
  options: props => ({
    variables: {
      type: "post",
      limit: props.limit || 3,
    },
  }),
  props: ({ data: { loading, posts } }) => ({
    posts,
    ploading: loading,
  }),
});
