import { graphql } from "@apollo/react-hoc";
import { GET_SINGLE_POST } from "../../shared/queries/Queries";

export default graphql(GET_SINGLE_POST, {
  options: (props: any) => ({
    variables: { id: parseInt(props.match.params.post_id) },
  }),
  props: ({ data: { loading, post } }: any) => ({
    post,
    loading,
  }),
});
