import { graphql } from "react-apollo";
import { GET_SINGLE_POST } from "../../shared/queries/Queries";

export default graphql(GET_SINGLE_POST, {
  options: props => ({ variables: { id: props.match.params.post_id } }),
  props: ({ data: { loading, post } }) => ({
    post,
    loading,
  }),
});
