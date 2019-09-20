import { graphql } from "@apollo/react-hoc";
import { GET_POST_BY_SLUG } from "../../shared/queries/Queries";

export default graphql(GET_POST_BY_SLUG, {
  options: props => {
    return {
      variables: {
        type: "post",
        slug: props.slug || props.match.params.slug,
      },
    };
  },
  props: ({ data: { loading, post } }) => ({
    post,
    loading,
  }),
});
