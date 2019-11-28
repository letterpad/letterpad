import { graphql } from "@apollo/react-hoc";
import { GET_POST_BY_SLUG } from "../../shared/queries/Queries";

export default graphql(GET_POST_BY_SLUG, {
  options: (props: any) => {
    return {
      variables: {
        type: "post",
        slug: props.slug || props.match.params.slug,
      },
    };
  },
  props: ({ data: { loading, post } }: any) => ({
    post,
    loading,
  }),
});
