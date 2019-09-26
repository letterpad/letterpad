import { graphql } from "@apollo/react-hoc";
import { CREATE_AUTHOR } from "../../shared/queries/Mutations";

export default graphql(CREATE_AUTHOR, {
  props: ({ mutate }) => ({
    createAuthor: data =>
      mutate({
        variables: data,
      }),
  }),
});
