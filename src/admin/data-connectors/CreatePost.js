import { graphql } from "@apollo/react-hoc";
import { CREATE_POST } from "../../shared/queries/Mutations";

export default graphql(CREATE_POST, {
  props: ({ mutate }) => ({
    createPost: data =>
      mutate({
        variables: data,
      }),
  }),
});
