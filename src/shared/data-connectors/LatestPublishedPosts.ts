import { graphql } from "@apollo/react-hoc";
import { GET_LATEST_PUBLISHED_POSTS } from "../queries/Queries";

export default graphql(GET_LATEST_PUBLISHED_POSTS, {
  options: (props: any) => ({
    variables: {
      type: "post",
      limit: props.limit || 3,
    },
  }),
  props: ({ data: { loading, posts } }: any) => ({
    posts,
    ploading: loading,
  }),
});
